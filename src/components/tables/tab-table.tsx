import { PaymentMethod, TabOverview, TabStatus } from "@/types/types";
import { useTabColumns } from "./tab-columns";
import { ColumnFiltersState, FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, SortingFn, sortingFns, useReactTable } from "@tanstack/react-table";
import React from "react";
import { compareItems, RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { ColumnFilter } from "./table";

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface SortingFns {
    fuzzy: SortingFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export const fuzzyFilterTab: FilterFn<TabOverview> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank
  })
  return itemRank.passed
}

export const fuzzySortTab: SortingFn<TabOverview> = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export function TabTable({ shopId, tabs }: {
  shopId: number,
  tabs: TabOverview[]
}) {
  const columns = useTabColumns(shopId)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([{
    id: "status",
    value: []
  },
  {
    id: "is_pending_balance",
    value: []
  }])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable<TabOverview>({
    data: tabs,
    columns,
    filterFns: {
      fuzzy: fuzzyFilterTab,
    },
    sortingFns: {
      fuzzy: fuzzySortTab

    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'fuzzy',
    initialState: {
      columnVisibility: {
        id: false,
      }
    },
    state: {
      columnFilters,
      globalFilter,
    }
  })

  return <div className="flex flex-col items-start gap-2 max-w-full">
    <div className="flex gap-2 items-end justify-between w-full">
      <Input placeholder="Search tabs..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.currentTarget.value)}
      />
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className="text-sm gap-1" size="sm">
              <ListFilter className="w-3.5 h-3.5" />
              <span> Filter </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={(table.getColumn('status')?.getFilterValue() as string[])?.includes(TabStatus.pending) ?? false}
              onCheckedChange={(val) => table.getColumn('status')?.setFilterValue((prev?: string[]) => { return val ? prev ? [...prev, TabStatus.pending] : [TabStatus.pending] : prev?.filter(v => v !== TabStatus.pending) })}
            >Pending</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={(table.getColumn('status')?.getFilterValue() as string[])?.includes(TabStatus.confirmed) ?? false}
              onCheckedChange={(val) => table.getColumn('status')?.setFilterValue((prev?: string[]) => { return val ? prev ? [...prev, TabStatus.confirmed] : [TabStatus.confirmed] : prev?.filter(v => v !== TabStatus.confirmed) })}
            >Confirmed</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={(table.getColumn('status')?.getFilterValue() as string[])?.includes(TabStatus.closed) ?? false}
              onCheckedChange={(val) => table.getColumn('status')?.setFilterValue((prev?: string[]) => { return val ? prev ? [...prev, TabStatus.closed] : [TabStatus.closed] : prev?.filter(v => v !== TabStatus.closed) })}
            >Closed</DropdownMenuCheckboxItem>
            <DropdownMenuLabel>Balance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={(table.getColumn('is_pending_balance')?.getFilterValue() as boolean[])?.includes(true) ?? false}
              onCheckedChange={(val) => table.getColumn('is_pending_balance')?.setFilterValue((prev?: boolean[]) => { return val ? prev ? [...prev, true] : [true] : prev?.filter(v => v !== true) })}
            >Unpaid</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={(table.getColumn('is_pending_balance')?.getFilterValue() as boolean[])?.includes(false) ?? false}
              onCheckedChange={(val) => table.getColumn('is_pending_balance')?.setFilterValue((prev?: boolean[]) => { return val ? prev ? [...prev, false] : [false] : prev?.filter(v => v !== false) })}
            >Paid</DropdownMenuCheckboxItem>
            <DropdownMenuLabel>Payment Method</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={(table.getColumn('payment_method')?.getFilterValue() as string[])?.includes(PaymentMethod.in_person) ?? false}
              onCheckedChange={(val) => table.getColumn('payment_method')?.setFilterValue((prev?: string[]) => { return val ? prev ? [...prev, PaymentMethod.in_person] : [PaymentMethod.in_person] : prev?.filter(v => v !== PaymentMethod.in_person) })}
            >In Person</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={(table.getColumn('payment_method')?.getFilterValue() as string[])?.includes(PaymentMethod.chartstring) ?? false}
              onCheckedChange={(val) => table.getColumn('payment_method')?.setFilterValue((prev?: string[]) => { return val ? prev ? [...prev, PaymentMethod.chartstring] : [PaymentMethod.chartstring] : prev?.filter(v => v !== PaymentMethod.chartstring) })}
            >Chartstring</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
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
                    : <>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanFilter() ? (
                        <div>
                          <ColumnFilter column={header.column} />
                        </div>

                      ) : null}
                    </>
                  }
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} >
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
