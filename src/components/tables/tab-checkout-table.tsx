import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { ColumnFiltersState, FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, SortingFn, sortingFns, useReactTable } from "@tanstack/react-table";
import { useTabCheckoutColumns } from "./tab-checkout-columns";
import { TabOverview } from "@/types/types";
import React from "react";
import { Input } from "../ui/input";
import { compareItems, RankingInfo, rankItem } from '@tanstack/match-sorter-utils'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";

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

const fuzzyFilterTab: FilterFn<TabOverview> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank
  })
  return itemRank.passed
}

const fuzzySortTab: SortingFn<TabOverview> = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className="text-sm gap-1" size="sm">
              <ListFilter className="w-3.5 h-3.5" />
              <span> Filter </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={table.getColumn('active')?.getFilterValue() as boolean ?? true}
              onCheckedChange={(val) => table.getColumn('active')?.setFilterValue(val)}
            >
              Active Tabs
            </DropdownMenuCheckboxItem>
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
