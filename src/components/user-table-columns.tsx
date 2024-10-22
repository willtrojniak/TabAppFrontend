import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DialogDeleteForm } from "./forms/dialog-delete-form";
import { ShopUser } from '@/types/types'
import { useOnErrorToast } from "@/api/toasts";
import { EditButton } from "./ui/edit-button";
import { useRemoveShopInvite } from "@/api/shops";
import { ShopUserFormDialog } from "./forms/shop-user-form";
import { Check } from "lucide-react";

export function useUserColumns(shopId: number): ColumnDef<ShopUser>[] {
  const onError = useOnErrorToast();
  const deleteInvite = useRemoveShopInvite()
  const onDelete = React.useCallback(async ({ shopId, email }: { shopId: number, email: string }) => {
    await deleteInvite.mutateAsync({ shopId, data: { email, roles: 1 } }, {
      onError,
    })
  }, [shopId])

  return React.useMemo(() => {
    return [
      {
        id: 'id',
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "confirmed",
        header: "Status",
        cell: ({ row }) => {
          const user = row.original
          return <div className="flex justify-center items-center">
            {!user.confirmed ? <span className="font-bold text-destructive text-lg">!</span> : <Check className="w-4 h-4" />}
          </div>
        }
      },
      {
        id: 'edit',
        cell: ({ row }) => {
          const user = row.original
          return <ShopUserFormDialog shopId={shopId} user={user} >
            <EditButton variant="ghost" />
          </ShopUserFormDialog>
        }
      },
      {
        id: 'delete',
        cell: ({ row }) => {
          const user = row.original
          return <DialogDeleteForm title="Remove User" onDelete={() => onDelete({ shopId, email: user.email })} />
        }
      },
    ]
  }, [shopId, onDelete])

}
