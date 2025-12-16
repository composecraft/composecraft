import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    // Apply checkAuth to routes under /dashboard
    if (req.nextUrl.pathname.includes("/dashboard")) {
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if (!rawToken) {
                return NextResponse.redirect(new URL("/", req.url));
            }

            // Secret key needs to be a Uint8Array for jose
            const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");

            // Verify the token using jose's jwtVerify method
            await jwtVerify(rawToken, secretKey);

        } catch (error) {
            console.error(error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    } else if (req.nextUrl.pathname.includes("/login") && !req.nextUrl.pathname.includes("/cli")) {
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if (rawToken) {
                const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
                await jwtVerify(rawToken, secretKey);
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        } catch (error) {
            console.error(error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    } else if (req.nextUrl.pathname.includes("/signin")) {
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if (rawToken) {
                const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
                await jwtVerify(rawToken, secretKey);
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        } catch (error) {
            console.error(error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // If authenticated or the route is not under /dashboard, continue the request
    return NextResponse.next();
}
