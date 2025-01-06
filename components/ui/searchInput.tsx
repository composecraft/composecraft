"use client"

import {Input, InputProps} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export default function SearchInput(attributes:InputProps){

    const router = useRouter();
    const searchParams = useSearchParams();
    const [value,setValue] = useState(searchParams.get('search') || "")

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }

        router.replace(`?${params.toString()}`, { scroll: false });
    })

    return(
        <Input {...attributes} value={value} onChange={(e)=>setValue(e?.target?.value)} />
    )
}