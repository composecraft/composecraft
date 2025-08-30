"use client"

import posthog from "posthog-js";
import { useEffect } from "react";

export default function Instrumentation({posthogKey}:{posthogKey:string}){

    useEffect(()=>{
        posthog.init(posthogKey, {
        api_host: "/mesures",
        ui_host: "https://eu.posthog.com",
        defaults: '2025-05-24',
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
    });
    },[posthogKey])

    return <></>
}