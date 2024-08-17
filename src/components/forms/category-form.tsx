import { useCreateCategory, useUpdateCategory } from "@/api/categories";
import { CategoryCreate, CategoryCreateRaw, categoryCreateSchema } from "@/types/schemas";
import { Category, ItemOverview } from "@/types/types";
import { AxiosError } from "axios";
import React from "react";
import { toast } from "../ui/use-toast";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DialogForm } from "./dialog-form";
import { SortableMultiSelect } from "../ui/sortable-select";

function getCategoryDefaults(category?: Category, index?: number) {
  return {
    name: category?.name ?? "",
    index: index ?? 0,
    item_ids: category?.items ?? []
  } satisfies CategoryCreateRaw
}

export function useCategoryForm({ shopId, category, index }: {
  shopId: number,
  category?: Category,
  index?: number
}) {
  const form = useForm<CategoryCreateRaw>({
    resolver: zodResolver(categoryCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getCategoryDefaults(category, index)
  })

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
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
        description: "A category with conflicting data already exists."
      })
    }
  }, [])

  const onSubmit = React.useCallback(async (v: unknown) => {
    const values = v as CategoryCreate;
    if (!category?.id) {
      await createCategory.mutateAsync({ shopId, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    } else {
      await updateCategory.mutateAsync({ shopId, categoryId: category.id, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    }
  }, [shopId, category?.id])
  const title = !category ? "Create Category" : "Edit Category"
  const desc = !category ? "Create a new category." : "Make changes to an existing category."

  React.useEffect(() => {
    form.reset(getCategoryDefaults(category))

  }, [category])

  return { form, onSubmit, title, desc }
}

export function CategoryFormDialog({ children, shopId, category, index, items }: { children: React.ReactNode, shopId: number, category?: Category, index?: number, items: ItemOverview[] }) {
  const { form, onSubmit, title, desc } = useCategoryForm({ shopId, category, index })

  return <DialogForm form={form} onSubmit={onSubmit} title={title} desc={desc} trigger={children} shouldClose={!category}>
    <CategoryFormBody control={form.control} category={category} items={items} />
  </DialogForm>
}

function CategoryFormBody({ control, items }: {
  control: Control<CategoryCreateRaw>,
  category?: Category,
  items: ItemOverview[]
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
            <Input {...field} placeholder="Drinks" />
          </FormControl>
          <FormDescription>Category name.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="item_ids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Items</FormLabel>
          <FormControl>
            <SortableMultiSelect
              {...field}
              isMulti
              options={items}
              getOptionValue={(i) => { const item = i as ItemOverview; return item.id.toString() }}
              getOptionLabel={(i) => { const item = i as ItemOverview; return item.name }}
            />
          </FormControl>
          <FormDescription>Items in the category. Drag to reorder.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
  </>
}
