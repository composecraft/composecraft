"use client"

import {Input, InputProps} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export default function SearchInput(attributes: InputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(searchParams.get('search') || "");
  }, [searchParams]);

   useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 300); // ← Adjust debounce time here (ms)

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <Input {...attributes} value={value} onChange={(e) => setValue(e.target.value)} />
  );
}