import { ItemVariant } from "@/types/types"
import { ColumnDef, isNumberArray } from "@tanstack/react-table"
import { Button } from "./ui/button"
import { Pencil } from "lucide-react"
import { formatCurrencyUSD } from "@/util/currency"
import { ItemVariantFormDialog } from "./forms/item-variant-from"
import { useDeleteItemVariant } from "@/api/item-variants"
import { DialogDeleteForm } from "./forms/dialog-delete-form"
import React from "react"
import { toast } from "./ui/use-toast"

export function useItemVariantColumns(shopId: number, itemId: number): ColumnDef<ItemVariant>[] {
  const deleteVariant = useDeleteItemVariant();
  const onDelete = React.useCallback(async ({ shopId, itemId, variantId }: { shopId: number, itemId: number, variantId: number }) => {
    await deleteVariant.mutateAsync({ shopId, itemId, variantId }, {
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
        header: "Variant"
      },
      {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        cell: ({ row }) => {
          const itemVariant = row.original
          const formatted = formatCurrencyUSD(itemVariant.price)
          return <div className="text-right font-medium">{formatted}</div>
        }
      },
      {
        id: 'edit',
        cell: ({ row }) => {
          const itemVariant = row.original
          return <ItemVariantFormDialog shopId={shopId} itemId={itemId} itemVariant={itemVariant} index={row.index} >
            <Button variant="ghost"> <Pencil className="h-4 w-4" /> </Button>
          </ItemVariantFormDialog>

        }
      },
      {
        id: 'delete',
        cell: ({ row }) => {
          const itemVariant = row.original
          return <DialogDeleteForm title="Delete Variant" onDelete={() => onDelete({ shopId, itemId, variantId: itemVariant.id })} />
        }
      },
    ]

  }, [shopId, itemId, onDelete])
}
