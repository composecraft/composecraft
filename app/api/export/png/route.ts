import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import client from '@/lib/mongodb';
import { ObjectId } from 'bson';
import { exportPlaygroundAsPNG } from '@/app/actions/exportActions';

export async function GET(request: NextRequest) {
    try {
        const composeId = request.nextUrl.searchParams.get('id');
        
        if (!composeId) {
            return NextResponse.json(
                { error: 'Compose ID is required' },
                { status: 400 }
            );
        }

        // Get compose data and metadata from database
        await client.connect();
        const db = client.db('compose_craft');
        const collection = db.collection('composes');

        const compose = await collection.findOne({
            _id: new ObjectId(composeId)
        });

        if (!compose) {
            return NextResponse.json(
                { error: 'Compose not found' },
                { status: 404 }
            );
        }

        // Create checksum from compose data and metadata
        const dataString = JSON.stringify(compose.data) + JSON.stringify(compose.metadata);
        const checksum = createHash('sha256').update(dataString).digest('hex').substring(0, 16);
        const filename = `playground-${checksum}.png`;
        const filepath = path.join(process.cwd(), 'public', 'exports', filename);

        // Check if file already exists
        let fileBuffer: Buffer | null = null;
        try {
            fileBuffer = await fs.readFile(filepath);
            console.log(`Using cached export file: ${filename}`);
        } catch {
            // File doesn't exist, generate it
            console.log(`Generating new export file: ${filename}`);
            fileBuffer = await exportPlaygroundAsPNG(composeId);
            
            // Create exports directory if it doesn't exist
            const exportsDir = path.dirname(filepath);
            await fs.mkdir(exportsDir, { recursive: true });
            
            // Save the file
            await fs.writeFile(filepath, fileBuffer);
        }
        
        return new NextResponse(fileBuffer as any, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Error exporting playground as PNG via API:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to export playground' },
            { status: 500 }
        );
    }
}
