"use server"

import { shareCompose } from './composeActions';
import { headers } from 'next/headers';

export async function generateGitHubMarkdown(composeId: string, composeName: string) {
    try {
        // First, create or get existing share
        const shareUrl = await shareCompose(composeId);
        
        if (!shareUrl) {
            throw new Error("Could not generate share for GitHub integration");
        }

        // Extract share ID from the URL
        // URL format: `${process.env.URL}/share?id=${share._id.toString()}`
        const shareId = shareUrl.split('id=')[1];

        if (!shareId) {
            throw new Error("Could not extract share ID from share URL");
        }

        // Get the host from the request headers
        const headersList = await headers();
        const host = headersList.get('host') || headersList.get('x-forwarded-host') || 'localhost:3000';
        const protocol = headersList.get('x-forwarded-proto') || 'https';

        // Generate the PNG export URL using shareId with the incoming request host
        const pngExportUrl = `${protocol}://${host}/api/export/png?shareId=${encodeURIComponent(shareId)}`;

        // Generate markdown with the PNG diagram
        const markdown = `![${composeName} - Docker Compose Architecture](${pngExportUrl})`;

        return {
            markdown,
            shareId,
            imageUrl: pngExportUrl
        };
    } catch (error) {
        console.error('Error generating GitHub markdown:', error);
        throw new Error(error instanceof Error ? error.message : "Failed to generate GitHub markdown");
    }
}
