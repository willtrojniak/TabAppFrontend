import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DialogDeleteForm } from "./forms/dialog-delete-form";
import { LocationOverview } from '@/types/types'
import { useDeleteLocation } from "@/api/locations";
import { useOnErrorToast } from "@/api/toasts";
import { EditButton } from "./ui/edit-button";
import { LocationFormDialog } from "./forms/location-form";

export function useLocationColumns(shopId: number): ColumnDef<LocationOverview>[] {
  const deleteLocation = useDeleteLocation();
  const onError = useOnErrorToast();
  const onDelete = React.useCallback(async ({ shopId, locationId }: { shopId: number, locationId: number }) => {
    await deleteLocation.mutateAsync({ shopId, locationId }, {
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
        header: "Location",
      },
      {
        id: 'edit',
        cell: ({ row }) => {
          const location = row.original
          return <LocationFormDialog shopId={shopId} location={location} >
            <EditButton variant="ghost" />
          </LocationFormDialog>

        }
      },
      {
        id: 'delete',
        cell: ({ row }) => {
          const location = row.original
          return <DialogDeleteForm title="Delete Location" onDelete={() => onDelete({ shopId, locationId: location.id })} />
        }
      },
    ]
  }, [shopId, onDelete])

}
