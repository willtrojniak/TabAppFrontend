import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { useTabCheckoutColumns } from "./tab-checkout-columns";
import { TabOverview } from "@/types/types";
import React from "react";
import { Input } from "../ui/input";
import { fuzzyFilterTab, fuzzySortTab } from "./tab-table";
import { Toggle } from "../ui/toggle";

export function TabCheckoutTable({ shopId, data, selectedTab, setSelectedTab }: {
  data: TabOverview[],
  shopId: number,
  selectedTab?: TabOverview,
  setSelectedTab: (tab: TabOverview) => void,
}) {

  const columns = useTabCheckoutColumns(shopId)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: 'active',
      value: true
    }
  ])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable<TabOverview>({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilterTab
    },
    sortingFns: {
      fuzzy: fuzzySortTab
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: false,
    globalFilterFn: 'fuzzy',
    initialState: {
      columnVisibility: {
        id: false,
      }
    },
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
    }
  })

  return <div className="flex flex-col items-start gap-2 max-w-full">
    <div className="flex gap-2 items-end justify-between w-full">
      <div className="flex gap-2 items-baseline">
        <Input placeholder="Search tabs..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.currentTarget.value)}
        />
        <div className="whitespace-nowrap">Selected tab: {selectedTab?.display_name ?? "-"}</div>
      </div>
      <div className="flex gap-2 items-center">
        <Toggle
          pressed={table.getColumn('active')?.getFilterValue() as boolean ?? true}
          onPressedChange={(val) => table.getColumn('active')?.setFilterValue(val)}
        >
          Active
        </Toggle>
      </div>
    </div>
    <div className="bg-background text-foreground rounded-md max-w-full max-h-full border overflow-scroll">
      <Table className="max-h-full overflow-y-auto">
        <TableHeader className="whitespace-nowrap">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  row.toggleSelected(true)
                  setSelectedTab(row.original)
                }}>
                {
                  row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
    </div >
  </div>

}
