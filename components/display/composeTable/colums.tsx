"use client"

import { ColumnDef } from "@tanstack/react-table"
import {formatDistanceToNow} from "date-fns";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";
import ComposeRow from "@/components/display/composeTable/composeRow";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ComposeLine = {
    id: string
    name: string,
    createdAt: number,
    updatedAt: number
}



export const columns: ColumnDef<ComposeLine>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created at
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row})=>{
            return(
                formatDistanceToNow(row.getValue("createdAt"), { addSuffix: true })
            )
        }
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Updated at
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row})=>{
            return(
                formatDistanceToNow(row.getValue("updatedAt"), { addSuffix: true })
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const data = row.original

            return (
                <ComposeRow {...data} />
            )
        },
    },
]
