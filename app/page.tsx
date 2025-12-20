"use server"

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export default async function Page() {
    const token = (await cookies()).get('token')?.value;
    
    if (token) {
        try {
            // Verify the token
            const secretKey = new TextEncoder().encode(process.env.SECRET_KEY || "");
            await jwtVerify(token, secretKey);
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
