import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { isCoreOnly } from '@/lib/config';

/**
 * Check if the given path is a core product page
 * In CORE_ONLY mode, non-core pages like /library and /docs are blocked
 */
function isCoreProductPage(path: string): boolean {
    if (path.startsWith("/library")) {
        console.log("non core product page triggered redirect to /");
        return false;
    } else if (path.startsWith("/docs")) {
        console.log("non core product page triggered redirect to /");
        return false;
    }
    return true;
}

export async function middleware(req: NextRequest) {
    // Block non-core pages in CORE_ONLY mode
    if (isCoreOnly()) {
        if (!isCoreProductPage(req.nextUrl.pathname)) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            await jwtVerify(rawToken, secretKey);

            // You can access the decoded token payload
            //console.log(payload);

        } catch (error) {
            console.error(error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    }else if(req.nextUrl.pathname.includes("/login") && !req.nextUrl.pathname.includes("/cli")){
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if(rawToken){
                const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
                await jwtVerify(rawToken, secretKey);
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        } catch (error) {
            console.error(error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    }else if(req.nextUrl.pathname.includes("/tryIt")){
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if(rawToken){
                const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
                await jwtVerify(rawToken, secretKey);
                return NextResponse.redirect(new URL("/dashboard/playground", req.url));
            }
        } catch (error) {
            console.error(error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    else if(req.nextUrl.pathname.includes("/signin")){
        const rawToken = (await cookies()).get("token")?.value;

        try {
            if(rawToken){
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
