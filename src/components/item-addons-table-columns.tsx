import { ItemOverview } from "@/types/types"
import { ColumnDef, isNumberArray } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { MoreHorizontal } from "lucide-react"
import { Separator } from "./ui/separator"
import { Link } from "@tanstack/react-router"

export function itemAddonColumns(shopId: number): ColumnDef<ItemOverview>[] {
  return [
    {
      accessorKey: 'id',
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        if (isNumberArray(filterValue)) {
          return filterValue.includes(row.getValue(columnId))
        }
        return true
      }
    },
    {
      accessorKey: "name",
      header: "Addon"
    },
    {
      accessorKey: "base_price",
      header: "Price",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        return <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to="/shops/$shopId/items/$itemId" params={{ shopId: shopId, itemId: item.id }}>
              <DropdownMenuItem>
                Edit
              </DropdownMenuItem>
            </Link>
            <Separator className="my-1" />
            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu >
      }
    }
  ]
}
