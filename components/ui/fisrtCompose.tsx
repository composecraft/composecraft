"use client"

import {Plus} from "lucide-react";

export default function FirstCompose(){
    return (
        <div className="flex flex-col justify-center items-center gap-3 py-10">
            <button onClick={() => {
                window.location.href = "/dashboard/playground"
            }} className="w-40 h-40 flex items-center justify-center">
                <Plus
                    className='w-full h-full p-12 stroke-slate-200 stroke-[3px] transition-all hover:p-10 bg-slate-50 rounded-lg border-dashed border-4 hover:bg-slate-200 hover:stroke-white hover:border-transparent'/>
            </button>
            <p className="text-lg font-bold">Create your first docker compose !</p>
        </div>
    )
}