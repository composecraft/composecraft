/**
 * Centralized configuration for Compose Craft
 * 
 * This module provides utilities to check the application mode
 * and configure behavior accordingly.
 */

/**
 * Check if the application is running in CORE_ONLY mode
 * 
 * When CORE_ONLY mode is enabled (for self-hosted instances):
 * - SEO features are disabled
 * - Marketing pages are hidden
 * - OAuth providers are disabled
 * - Only core functionality is available
 * 
 * This function works on both server and client side by using NEXT_PUBLIC_CORE_ONLY
 * 
 * @returns {boolean} true if CORE_ONLY mode is enabled
 */
export const isCoreOnly = (): boolean => {
    // Use NEXT_PUBLIC_CORE_ONLY for client-side compatibility
    // This prevents hydration errors in client components
    if (typeof window !== 'undefined') {
        // Client-side
        return process.env.NEXT_PUBLIC_CORE_ONLY === 'true';
    } else {
        // Server-side - check both variables for backward compatibility
        return process.env.CORE_ONLY === 'true' || process.env.NEXT_PUBLIC_CORE_ONLY === 'true';
    }
};
