import { ItemOverview } from "@/types/types"
import { ColumnDef, isNumberArray } from "@tanstack/react-table"
import { DialogDeleteForm } from "./forms/dialog-delete-form"
import React from "react"
import { useDeleteItem } from "@/api/items"
import { toast } from "./ui/use-toast"
import { Button } from "./ui/button"
import { Link } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"
import { formatCurrencyUSD } from "@/util/currency"

export function useItemColumns(shopId: number): ColumnDef<ItemOverview>[] {
  const deleteItem = useDeleteItem();
  const onDelete = React.useCallback(async ({ shopId, itemId }: { shopId: number, itemId: number }) => {
    await deleteItem.mutateAsync({ shopId, itemId }, {
      onError: () => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was an issue deleting the item.",
          variant: "destructive",
          duration: 5000
        })
      }
    })
  }, [shopId])

  return React.useMemo(() => {
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
        header: "Item",
        cell: ({ row }) => {
          const item = row.original
          return <Button asChild variant="link"><Link to="/shops/$shopId/items/$itemId" params={{ shopId, itemId: item.id }}>{item.name}<ExternalLink className="ml-2 w-4 h-4" /></Link></Button>
        }
      },
      {
        accessorKey: "base_price",
        header: () => <div className="text-right">Base Price</div>,
        cell: ({ row }) => {
          const item = row.original
          const formatted = formatCurrencyUSD(item.base_price)
          return <div className="text-right font-medium">{formatted}</div>
        }
      },
      {
        id: 'delete',
        cell: ({ row }) => {
          const item = row.original
          return <DialogDeleteForm title="Delete Item" onDelete={() => onDelete({ shopId, itemId: item.id })} />
        }
      },
    ]
  }, [shopId, onDelete])

}
