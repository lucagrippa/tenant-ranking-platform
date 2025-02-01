"use client"

import { ArrowUpDown, X } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

import { Application } from "@/lib/application"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface TableMeta {
    removeRow: (id: string) => void;
}

export const columns: ColumnDef<Application>[] = [
    {
        id: "name",
        header: () => <div className="text-left">Name</div>,
        cell: ({ row }) => {
            const name: string = row.original.firstName + " " + row.original.lastName
            const formattedName = name.replace(/&amp;/g, "&")
            const slicedName = formattedName.length > 25 ? formattedName.slice(0, 25) + "..." : formattedName
            return <div className="text-left font-medium sm:block">{slicedName}</div>
        },
        filterFn: (row, id, value) => {
            const searchTerm = value.toLowerCase();
            const firstName = row.original.firstName.toLowerCase();
            const lastName = row.original.lastName.toLowerCase();
            const fullName = `${firstName} ${lastName}`;

            return firstName.includes(searchTerm) ||
                lastName.includes(searchTerm) ||
                fullName.includes(searchTerm);
        },
    },
    {
        id: 'hometown',
        accessorKey: "hometown",
        header: () => <div className="text-center sm:block">Hometown</div>,
        cell: ({ row }) => {
            const hometown: string = row.getValue("hometown")
            return <div className="text-center sm:block">{hometown}</div>
        },
    },
    {
        accessorKey: "profession",
        header: () => <div className="text-center">Profession</div>,
        cell: ({ row }) => {
            const profession: string = row.getValue("profession")
            return <div className="text-center sm:block">{profession}</div>
        },
        filterFn: "arrIncludesSome",
    },
    // {
    //     id: "email",
    //     accessorKey: "email",
    //     header: () => <div className="text-center">Email</div>,
    //     cell: ({ row }) => {
    //         const email: string = row.original.email
    //         return <div className="text-center sm:block">{email}</div>
    //     },
    // },
    {
        accessorKey: "income",
        // header: () => <div className="text-center sm:block">Income</div>,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full flex justify-center"
                >
                    Income
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const income: string = row.getValue("income")
            return <div className="text-center sm:block">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(income))}</div>
        },
    },
    {
        id: 'funds',
        accessorKey: "funds",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full flex justify-center"
                >
                    Funds
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const funds: string = row.getValue("funds")
            return <div className="text-center sm:block">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(funds))}</div>
        },
    },
    {
        id: 'proposedRent',
        accessorKey: "proposedRent",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full flex justify-center"
                >
                    Proposed Rent
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const proposedRent: string = row.getValue("proposedRent")
            return <div className="text-center sm:block">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(proposedRent))}</div>
        },
    },
    {
        id: 'otherOccupants',
        accessorKey: "otherOccupants",
        header: () => <div className="text-center sm:block">Other Occupants</div>,
        cell: ({ row }) => {
            const otherOccupants: string[] = row.getValue("otherOccupants")
            return <div className="text-center sm:block">{otherOccupants.length}</div>
        },
    },
    {
        id: 'roommates',
        accessorKey: "roommates",
        header: () => <div className="text-center sm:block">Roommates</div>,
        cell: ({ row }) => {
            const roommates: string[] = row.getValue("roommates")
            return <div className="text-center sm:block">{roommates.length}</div>
        },
    },
    {
        accessorKey: "startingDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full flex justify-center"
                >
                    Starting Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const startingDate: string = row.getValue("startingDate")
            return <div className="text-center sm:block">{new Date(startingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        },
    },
    {
        id: 'delete',
        cell: ({ row, table }) => {
            const meta = table.options.meta as TableMeta
            return (
                <Button
                    variant="outline"
                    onClick={() => {
                        // remove row from local storage
                        meta.removeRow(row.original.id)
                        // remove row from table
                        table.setRowSelection({
                            [row.id]: false,
                        })
                        // TODO: Implement delete functionality
                        console.log('Delete clicked for row:', row.original)
                    }}
                    className="w-full flex justify-center rounded-full"
                >
                    <X className="h-4 cursor-pointer" />
                </Button>
            )
        },
    },
]
