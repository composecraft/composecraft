"use client"

import { useEffect, useState } from 'react';
import {X} from "lucide-react";

export default function BetaBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the 'bannerClosed' cookie is set
        const isClosed = document.cookie
            .split('; ')
            .find(row => row.startsWith('bannerClosed='))
            ?.split('=')[1];

        if (!isClosed) {
            setIsVisible(true);
        }
    }, []);

    const closeBanner = () => {
        // Set the 'bannerClosed' cookie with an expiration of 3 days
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 3);
        document.cookie = `bannerClosed=true; expires=${expirationDate.toUTCString()}; path=/`;
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="flex flex-row w-full bg-blue-100 items-center py-1 px-10 justify-between">
            <span></span>
            <p>🧪 This software is currently under beta. If you want to know more you can join our <a className="underline" href="https://discord.gg/GBxRWQa6Dw">Discord</a></p>
            <button onClick={closeBanner}>
                <X className="stroke-slate-500" />
            </button>
        </div>
    );
}
