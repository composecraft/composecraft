import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    // Check if SECRET_KEY is configured
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
        console.error("SECRET_KEY environment variable is not configured. Authentication cannot be verified.");
        // Fail securely by redirecting to home page
        return NextResponse.redirect(new URL("/", req.url));
    }

    const encodedSecretKey = new TextEncoder().encode(secretKey);

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
            const response = NextResponse.redirect(new URL("/", req.url));
            response.cookies.delete("token");
            return response;
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
            const response = NextResponse.redirect(new URL("/", req.url));
            response.cookies.delete("token");
            return response;
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
            const response = NextResponse.redirect(new URL("/", req.url));
            response.cookies.delete("token");
            return response;
        }
    }

    // If authenticated or the route is not under /dashboard, continue the request
    return NextResponse.next();
}
