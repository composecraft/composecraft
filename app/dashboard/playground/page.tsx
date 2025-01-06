"use client"

import {Suspense} from 'react';
import PlaygroundContent from "@/components/playground/playGroundContent";

// Main component with Suspense boundary
export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PlaygroundContent />
        </Suspense>
    );
}