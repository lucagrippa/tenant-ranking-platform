"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const professions = table.getColumn("profession")?.getFacetedUniqueValues()?.entries() ?? []
    const professionOptions = Array.from(professions, ([value]) => ({
        label: value,
        value: value,
    }))

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search by name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("profession") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("profession")}
                        title="Profession"
                        options={professionOptions}
                    />
                )}
                {table.getColumn("profession")?.getFilterValue() !== undefined && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.getColumn("profession")?.setFilterValue(undefined)}
                        className="h-8 px-2 lg:px-3"
                    >
                        Clear filters
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}