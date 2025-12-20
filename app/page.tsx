"use server"

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export default async function Page() {
    const token = (await cookies()).get('token')?.value;

    if (token) {
        try {
            // Check if SECRET_KEY is configured
            const secretKey = process.env.SECRET_KEY;
            if (!secretKey) {
                console.error("SECRET_KEY environment variable is not configured. Cannot verify authentication.");
                redirect('/login');
            }

            // Verify the token
            const encodedSecretKey = new TextEncoder().encode(secretKey);
            await jwtVerify(token, encodedSecretKey);
            // User is authenticated, redirect to dashboard
            redirect('/dashboard');
        } catch {
            // Token is invalid, redirect to login
            redirect('/login');
        }
    } else {
        // No token, redirect to login
        redirect('/login');
    }
}
