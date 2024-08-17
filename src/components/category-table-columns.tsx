import { Category } from "@/types/types";
import { ColumnDef, isNumberArray } from "@tanstack/react-table";
import React from "react";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { DialogDeleteForm } from "./forms/dialog-delete-form";
import { CategoryFormDialog } from "./forms/category-form";
import { useDeleteCategory } from "@/api/categories";
import { toast } from "./ui/use-toast";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getShopItemsQueryOptions } from "@/api/items";

export function useCategoryColumns(shopId: number): ColumnDef<Category>[] {
  const deleteItem = useDeleteCategory();
  const { data: items } = useSuspenseQuery(getShopItemsQueryOptions(shopId))
  const onDelete = React.useCallback(async ({ shopId, categoryId }: { shopId: number, categoryId: number }) => {
    await deleteItem.mutateAsync({ shopId, categoryId }, {
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
        header: "Category",
      },
      {
        id: 'edit',
        cell: ({ row }) => {
          const category = row.original
          return <CategoryFormDialog shopId={shopId} category={category} index={row.index} items={items} >
            <Button variant="ghost"> <Pencil className="h-4 w-4" /> </Button>
          </CategoryFormDialog>

        }
      },
      {
        id: 'delete',
        cell: ({ row }) => {
          const category = row.original
          return <DialogDeleteForm title="Delete Category" onDelete={() => onDelete({ shopId, categoryId: category.id })} />
        }
      },
    ]
  }, [shopId, onDelete])

}
