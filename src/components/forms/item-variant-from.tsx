import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { ItemVariant } from "@/types/types";
import { ItemVariantCreate, ItemVariantCreateInput, itemVariantCreateSchema } from "@/types/schemas";
import { useCreateItemVariant, useUpdateItemVariant } from "@/api/item-variants";
import { ItemUpdateIds } from "@/api/items";
import { toast } from "../ui/use-toast";
import { AxiosError } from "axios";
import { DialogForm } from "./dialog-form";
import React from "react";

export function useItemVariantForm({ shopId, itemId, itemVariant, index }: { shopId: number, itemId: number, itemVariant?: ItemVariant, index?: number }) {
  const form = useForm<ItemVariantCreateInput>({
    resolver: zodResolver(itemVariantCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: itemVariant?.name ?? "",
      price: itemVariant?.price.toFixed(2) ?? "",
      index: index ?? 0,
    }
  });

  const createMutate = useCreateItemVariant()
  const updateMutate = useUpdateItemVariant()
  const onError = React.useCallback((error: Error) => {
    if (!(error instanceof AxiosError) || !error.response || error.response.status !== 409) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An unknown error has occured"
      })
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An item variant with conflicting data already exists."
      })
    }

  }, [])

  async function onSubmit(v: unknown) {
    const values = v as ItemVariantCreate
    if (!itemVariant?.id) {
      await createMutate.mutateAsync({ shopId, itemId, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    } else {
      await updateMutate.mutateAsync({ shopId, itemId, variantId: itemVariant.id, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    }
  }

  const title = !itemVariant ? "Create Variant" : "Edit Variant"
  const desc = !itemVariant ? "Create a new item variant." : "Make changes to an existing item variant."

  return { form, onSubmit, title, desc };
}


export function ItemVariantFormDialog({ children, shopId, itemId, itemVariant, index }: { children: React.ReactNode, itemVariant?: ItemVariant, index?: number } & ItemUpdateIds) {
  const { form, onSubmit, title, desc } = useItemVariantForm({ shopId, itemId, itemVariant, index })

  return <DialogForm form={form} title={title} desc={desc} trigger={children} onSubmit={onSubmit} shouldClose={!itemVariant}>
    <ItemVariantFormBody control={form.control} />
  </DialogForm>
}

function ItemVariantFormBody({ control }: {
  control: Control<ItemVariantCreateInput>
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
            <Input {...field} placeholder="i.e. Large" />
          </FormControl>
          <FormDescription>Variant name.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl>
            <PriceInput {...field} placeholder="0.50" />
          </FormControl>
          <FormDescription>Added to item's base price.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
  </>
}
