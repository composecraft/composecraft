import React from "react";
import {Metadata} from "next";

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata(
): Promise<Metadata> {
    // read route params
    return {
        "robots" : "noindex, nofollow"
    }
}

export default function Layout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
