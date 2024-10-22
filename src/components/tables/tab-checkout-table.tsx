import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { useTabCheckoutColumns } from "./tab-checkout-columns";
import { Shop, TabOverview } from "@/types/types";
import React from "react";
import { Input } from "../ui/input";
import { fuzzyFilterTab, fuzzySortTab } from "./tab-table";
import { Toggle } from "../ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { parseInt } from "lodash";

export function TabCheckoutTable({ shop, data, selectedTab, setSelectedTab }: {
  data: TabOverview[],
  shop: Shop,
  selectedTab?: TabOverview,
  setSelectedTab: (tab: TabOverview) => void,
}) {

  const columns = useTabCheckoutColumns(shop.id)
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
    <div className="flex flex-col gap-2 w-full">
      <div className="whitespace-nowrap">Selected: <b>{selectedTab?.display_name ?? "-"}</b></div>
      <div className="flex flex-wrap gap-2 items-end justify-between w-full">
        <Input placeholder="Search tabs..."
          className="min-w-48 max-w-64 flex-1"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.currentTarget.value)}
        />
        <div className="flex gap-2 items-center">
          <Select onValueChange={(v) => table.getColumn('location')?.setFilterValue(parseInt(v))} value={table.getColumn('location')?.getFilterValue()?.toString() ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select shop location..." />
            </SelectTrigger>
            <SelectContent>
              {shop.locations.map(o => (<SelectItem key={o.id} value={o.id.toString()}>{o.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Toggle
            pressed={table.getColumn('active')?.getFilterValue() as boolean ?? true}
            onPressedChange={(val) => table.getColumn('active')?.setFilterValue(val)}
          >
            Active
          </Toggle>
        </div>
      </div>
    </div>
    <div className="bg-background text-foreground rounded-md max-w-full max-h-96 border overflow-scroll">
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
                }}
                className="cursor-pointer data-[state=selected]:bg-yellow-100 data-[state=selected]:text-black">
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
  </div >

}
