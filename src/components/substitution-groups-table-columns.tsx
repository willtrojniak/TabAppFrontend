import { SubstitutionGroup } from "@/types/types";
import { ColumnDef, isNumberArray } from "@tanstack/react-table";
import React from "react";
import { DialogDeleteForm } from "./forms/dialog-delete-form";
import { toast } from "./ui/use-toast";
import { useDeleteSubstitutionGroup } from "@/api/substitutions";
import { SubstitutionGroupFormDialog } from "./forms/substitution-group-form";
import { EditButton } from "./ui/edit-button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getShopItemsQueryOptions } from "@/api/items";

export function useSubstitutionGroupColumns(shopId: number): ColumnDef<SubstitutionGroup>[] {
  const deleteItem = useDeleteSubstitutionGroup();
  const { data: items } = useSuspenseQuery(getShopItemsQueryOptions(shopId))
  const onDelete = React.useCallback(async ({ shopId, groupId }: { shopId: number, groupId: number }) => {
    await deleteItem.mutateAsync({ shopId, groupId }, {
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
        header: "Substitution Group",
      },
      {
        id: 'edit',
        cell: ({ row }) => {
          const group = row.original
          return <SubstitutionGroupFormDialog shopId={shopId} group={group} items={items}><EditButton /></SubstitutionGroupFormDialog>
        }
      },
      {
        id: 'delete',
        cell: ({ row }) => {
          const group = row.original
          return <DialogDeleteForm title="Delete Substitution Group" onDelete={() => onDelete({ shopId, groupId: group.id })} />
        }
      },
    ]
  }, [shopId, onDelete, items])

}
