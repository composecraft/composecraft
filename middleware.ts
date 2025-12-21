import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getExportRenderToken } from '@/lib/exportToken';

export async function middleware(req: NextRequest) {
    // Check if SECRET_KEY is configured
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        console.error("SECRET_KEY environment variable is not configured. Authentication cannot be verified.");
        // Fail securely by redirecting to home page
        return NextResponse.redirect(new URL("/", req.url));
    }

    const encodedSecretKey = new TextEncoder().encode(secretKey);

    // Protect /playground/export-render route - only allow requests with valid token
    if (req.nextUrl.pathname.includes("/playground/export-render")) {
        const token = req.nextUrl.searchParams.get("token");
        const validToken = getExportRenderToken();

        if (!token || token !== validToken) {
            console.error("Invalid or missing export render token");
            return NextResponse.json(
                { error: "Unauthorized - Invalid or missing token" },
                { status: 401 }
            );
        }
    }

    // Apply checkAuth to routes under /dashboard
    if (req.nextUrl.pathname.includes("/dashboard")) {
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if (!rawToken) {
                return NextResponse.redirect(new URL("/", req.url));
            }

            // Verify the token using jose's jwtVerify method
            await jwtVerify(rawToken, encodedSecretKey);

        } catch (error) {
            console.error("JWT verification failed:", error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    } else if (req.nextUrl.pathname.includes("/login") && !req.nextUrl.pathname.includes("/cli")) {
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if (rawToken) {
                await jwtVerify(rawToken, encodedSecretKey);
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        } catch (error) {
            console.error("JWT verification failed:", error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    } else if (req.nextUrl.pathname.includes("/signin")) {
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if (rawToken) {
                await jwtVerify(rawToken, encodedSecretKey);
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        } catch (error) {
            console.error("JWT verification failed:", error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // If authenticated or the route is not under /dashboard, continue the request
    return NextResponse.next();
}
