'use server';

import puppeteer from 'puppeteer';
import { createHash } from 'crypto';
import { getExportRenderToken } from '@/lib/exportToken';
import sharp from 'sharp';
import path from 'path';

/**
 * Remove yellow background from PNG and make it transparent using sharp
 * @param pngBuffer - PNG buffer with yellow background
 * @returns PNG buffer with transparent background
 */
async function removeYellowBackground(pngBuffer: Buffer): Promise<Buffer> {
    // Convert PNG to raw RGBA data for pixel manipulation
    const {data, info} = await sharp(pngBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    // Process pixels to remove yellow and make transparent
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel is close to yellow (#FFFF00)
        // Yellow is R=255, G=255, B=0 with tolerance
        if (
            r > 240 &&
            g > 240 &&
            b < 15
        ) {
            // Make it fully transparent
            data[i + 3] = 0;
        }
    }

    // Convert back to PNG
    let result = await sharp(data, {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4,
        },
    }).png().toBuffer();

    // Add watermark in top right corner
    try {
        const watermarkPath = path.join(process.cwd(), 'assets', 'watermark.png');
        
        // Resize watermark to small size (100px wide)
        const watermarkBuffer = await sharp(watermarkPath)
            .resize(300, 300, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .toBuffer();

        // Get the dimensions of the main image
        const metadata = await sharp(result).metadata();
        const imgWidth = metadata.width || 0;

        // Position: top-right with 10px padding
        const watermarkX = imgWidth - 300 - 10;
        const watermarkY = 10;

        // Composite the watermark onto the main image
        result = await sharp(result)
            .composite([
                {
                    input: watermarkBuffer,
                    left: watermarkX,
                    top: watermarkY,
                    blend: 'over',
                },
            ])
            .png()
            .toBuffer();
    } catch (error) {
        console.warn('Failed to add watermark:', error);
        // Continue without watermark if it fails
    }

    return result;
}

/**
 * Export playground as PNG using headless browser
 * @param composeId - The ID of the compose to export
 * @param baseUrl - The base URL of the application (default: localhost:3000)
 * @returns PNG image as buffer
 */
export async function exportPlaygroundAsPNG(
    composeId: string,
    baseUrl: string = 'http://localhost:3000'
): Promise<Buffer> {
    let browser = null;

    try {
        // Launch headless browser
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
            ],
        });

        const page = await browser.newPage();

        // Set viewport for consistent rendering
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2,
        });

        // Get the export token
        const exportToken = getExportRenderToken();

        // Navigate to the render page with the security token
        const renderUrl = `${baseUrl}/playground/export-render?id=${encodeURIComponent(composeId)}&token=${encodeURIComponent(exportToken)}`;
        
        await page.goto(renderUrl, {
            waitUntil: 'networkidle2',
            timeout: 30000,
        });

        // Wait for playground to be ready
        await page.waitForFunction(
            () => (window as any).__PLAYGROUND_READY__ === true,
            {
                timeout: 10000,
            }
        );

        // Wait a bit more for smooth rendering
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));

        // Take screenshot of the react-flow element
        const reactFlowElement = await page.$('.react-flow');

        if (!reactFlowElement) {
            throw new Error('Playground element not found');
        }

        // Get the bounding box of the element
        const boundingBox = await reactFlowElement.boundingBox();

        if (!boundingBox) {
            throw new Error('Could not get bounding box of playground');
        }

        // Capture screenshot of the playground area
        let screenshot = await page.screenshot({
            clip: {
                x: boundingBox.x,
                y: boundingBox.y,
                width: boundingBox.width,
                height: boundingBox.height,
            },
            type: 'png',
        }) as Buffer;

        // Remove yellow background and make it transparent
        screenshot = await removeYellowBackground(screenshot);

        return screenshot;
    } catch (error) {
        console.error('Error exporting playground as PNG:', error);
        throw new Error(`Failed to export playground: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
        // Clean up: close the browser
        if (browser) {
            await browser.close();
        }
    }
}

/**
 * Export playground and save to file with checksum-based naming
 * @param composeId - The ID of the compose to export
 * @param baseUrl - The base URL of the application
 * @returns File path where the PNG was saved
 */
export async function exportPlaygroundAsPNGToFile(
    composeId: string,
    baseUrl?: string
): Promise<string> {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    const client = (await import('@/lib/mongodb')).default;

    try {
        // Get compose data and metadata from database
        await client.connect();
        const db = client.db('compose_craft');
        const collection = db.collection('composes');
        const { ObjectId } = await import('bson');

        const compose = await collection.findOne({
            _id: new ObjectId(composeId)
        });

        if (!compose) {
            throw new Error('Compose not found');
        }

        // Create checksum from compose data and metadata
        const dataString = JSON.stringify(compose.data) + JSON.stringify(compose.metadata);
        const checksum = createHash('sha256').update(dataString).digest('hex').substring(0, 16);

        // Create exports directory if it doesn't exist
        const exportsDir = path.join(process.cwd(), 'public', 'exports');
        await fs.mkdir(exportsDir, { recursive: true });

        // Generate filename based on checksum
        const filename = `playground-${checksum}.png`;
        const filepath = path.join(exportsDir, filename);
        
        console.log(filepath);

        // Check if file already exists - if so, return it without regenerating
        try {
            await fs.access(filepath);
            console.log(`Export file already exists: ${filename}`);
            return `/exports/${filename}`;
        } catch {
            // File doesn't exist, proceed with generation
        }

        // Get the PNG buffer
        const pngBuffer = await exportPlaygroundAsPNG(composeId, baseUrl);

        // Save the file
        await fs.writeFile(filepath, pngBuffer);
        console.log(`Export file created: ${filename}`);

        // Return relative path for serving
        return `/exports/${filename}`;
    } catch (error) {
        console.error('Error saving PNG to file:', error);
        throw error;
    }
}
