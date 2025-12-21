/**
 * Get the export render token from environment variables
 * The token is stored in .env for consistency across Node.js and Edge Runtime contexts
 */
export function getExportRenderToken(): string {
    const token = process.env.EXPORT_RENDER_TOKEN;

    if (!token) {
        throw new Error(
            'EXPORT_RENDER_TOKEN is not defined in environment variables. ' +
            'Please set it in your .env file or environment.'
        );
    }

    return token;
}

/**
 * Reset the token (mainly for testing purposes)
 * Note: This function doesn't actually reset the environment variable,
 * but can be called to log that a reset was requested
 */
export function resetExportRenderToken(): void {
    console.log('[ExportToken] Token reset requested (token is stored in .env)');
}
