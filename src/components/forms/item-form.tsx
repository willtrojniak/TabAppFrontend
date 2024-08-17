import { ItemCreate, ItemCreateInput, itemCreateSchema } from "@/types/schemas";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Control, useForm } from "react-hook-form";
import { PriceInput } from "@/components/ui/price-input";
import { Category, CategoryOverview, Item, ItemOverview, SubstitutionGroup } from "@/types/types";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "../ui/use-toast";
import { DialogForm } from "./dialog-form";
import { useCreateItem, useUpdateItem } from "@/api/items";
import { CardForm } from "./card-form";
import { ReactSelect } from "../ui/react-select";
import { SortableMultiSelect } from "../ui/sortable-select";

function getItemDefaults(item?: Item) {
  return {
    name: item?.name ?? "",
    base_price: item?.base_price.toFixed(2) ?? "",
    substitution_group_ids: item?.substitution_groups ?? [],
    category_ids: item?.categories ?? [],
    addon_ids: item?.addons ?? [],
  } satisfies ItemCreateInput
}

export function useItemForm({ shopId, item }: { shopId: number, item?: Item }) {
  const form = useForm<ItemCreateInput>({
    resolver: zodResolver(itemCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getItemDefaults(item)
  });

  const createMutate = useCreateItem()
  const updateMutate = useUpdateItem()
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
  React.useEffect(() => {
    form.reset(getItemDefaults(item), { keepValues: false })
  }, [item])


  const onSubmit = React.useCallback(async (v: unknown) => {
    const values = v as ItemCreate
    if (!item?.id) {
      await createMutate.mutateAsync({ shopId, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    } else {
      await updateMutate.mutateAsync({ shopId, itemId: item.id, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    }
  }, [shopId, item?.id])

  const title = !item ? "Create Item" : "Edit Item"
  const desc = !item ? "Create a new item." : "Make changes to an existing item."

  return { form, onSubmit, title, desc }
}

export function ItemFormDialog({ children, shopId, item, categories, addons, substitutions }: { children: React.ReactNode, shopId: number, item?: Item, categories: CategoryOverview[] | Category[], addons: ItemOverview[], substitutions: SubstitutionGroup[] }) {
  const { form, onSubmit, title, desc } = useItemForm({ shopId, item })

  return <DialogForm form={form} title={title} desc={desc} trigger={children} onSubmit={onSubmit} shouldClose={!item}>
    <ItemFormBody control={form.control} categories={categories} addons={addons} substitutions={substitutions} />
  </DialogForm>
}

export function ItemFormCard({ shopId, item, categories, addons, substitutions }: { shopId: number, item?: Item, categories: CategoryOverview[] | Category[], addons: ItemOverview[], substitutions: SubstitutionGroup[] }) {
  const { form, onSubmit, title, desc } = useItemForm({ shopId, item })

  return <CardForm form={form} title={title} desc={desc} onSubmit={onSubmit}>
    <ItemFormBody control={form.control} categories={categories} addons={addons} substitutions={substitutions} />
  </CardForm>

}

function ItemFormBody({ control, categories, addons, substitutions }
  : {
    control: Control<ItemCreateInput>
    categories: Category[] | CategoryOverview[],
    addons: ItemOverview[],
    substitutions: SubstitutionGroup[]
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
            <Input {...field} placeholder="i.e. Latte" />
          </FormControl>
          <FormDescription>Variant name.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="base_price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl>
            <PriceInput {...field} placeholder="4.50" />
          </FormControl>
          <FormDescription>The item's base price.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="category_ids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categories</FormLabel>
          <FormControl>
            <ReactSelect
              {...field}
              isMulti
              options={categories}
              getOptionValue={(o) => { const category = o as CategoryOverview; return category.id.toString() }}
              getOptionLabel={(o) => { const category = o as CategoryOverview; return category.name }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="substitution_group_ids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Substitutions</FormLabel>
          <FormControl>
            <SortableMultiSelect
              {...field}
              isMulti
              options={substitutions}
              getOptionValue={(o) => { const group = o as SubstitutionGroup; return group.id.toString() }}
              getOptionLabel={(o) => { const group = o as SubstitutionGroup; return group.name }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="addon_ids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Addons</FormLabel>
          <FormControl>
            <SortableMultiSelect
              {...field}
              isMulti
              options={addons}
              getOptionValue={(o) => { const item = o as ItemOverview; return item.id.toString() }}
              getOptionLabel={(o) => { const item = o as ItemOverview; return item.name }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
  </>
}
