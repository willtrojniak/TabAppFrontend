import { LocationCreate, LocationCreateInput, locationCreateSchema } from "@/types/schemas";
import { LocationOverview } from "@/types/types";
import React from "react";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DialogForm } from "./dialog-form";
import { useCreateLocation, useUpdateLocation } from "@/api/locations";
import { useOnErrorToast, useOnSuccessToast } from "@/api/toasts";

function getLocationDefaults(location?: LocationOverview) {
  return {
    name: location?.name ?? "",
  } satisfies LocationCreateInput
}

export function useLocationForm({ shopId, location }: {
  shopId: number,
  location?: LocationOverview,
}) {
  const form = useForm<LocationCreateInput>({
    resolver: zodResolver(locationCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getLocationDefaults(location)
  })

  const onSuccess = useOnSuccessToast();
  const onError = useOnErrorToast();

  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();

  const onSubmit = React.useCallback(async (v: unknown) => {
    const values = v as LocationCreate;
    if (!location?.id) {
      await createLocation.mutateAsync({ shopId, data: values }, {
        onSuccess: () => onSuccess("Successfully created location."),
        onError,
      })
    } else {
      await updateLocation.mutateAsync({ shopId, locationId: location.id, data: values }, {
        onSuccess: () => onSuccess("Successfully updated location"),
        onError,
      })
    }
  }, [shopId, location?.id])
  const title = !location?.id ? "Create Location" : "Edit Location"
  const desc = !location?.id ? "Create a new location." : "Make changes to an existing location."

  React.useEffect(() => {
    form.reset(getLocationDefaults(location))

  }, [location])

  return { form, onSubmit, title, desc }
}

export function LocationFormDialog({ children, shopId, location }: { children: React.ReactNode, shopId: number, location?: LocationOverview }) {
  const { form, onSubmit, title, desc } = useLocationForm({ shopId, location })

  return <DialogForm form={form} onSubmit={onSubmit} title={title} desc={desc} trigger={children} shouldClose>
    <LocationFormBody control={form.control} />
  </DialogForm>
}

function LocationFormBody({ control }: {
  control: Control<LocationCreateInput>,
  location?: LocationOverview,
}) {
  return <>
    <FormField
      control={control}
      name="name"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Main St." />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
  </>
}
