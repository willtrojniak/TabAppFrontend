import { useDeleteCategory, useGetShopCategories } from '@/api/categories'
import { getShopItemsQueryOptions } from '@/api/items'
import { getShopSubstitutionsQueryOptions } from '@/api/substitutions'
import { useOnErrorToast, useOnSuccessToast } from '@/api/toasts'
import { CategoryTabSelect } from '@/components/category-items'
import { DataTable } from '@/components/data-table'
import { CategoryFormDialog, useCategoryForm } from '@/components/forms/category-form'
import { DialogDeleteForm } from '@/components/forms/dialog-delete-form'
import { ItemFormDialog } from '@/components/forms/item-form'
import { SubstitutionGroupFormDialog } from '@/components/forms/substitution-group-form'
import { SortableInput } from '@/components/sortable-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateButton } from '@/components/ui/create-button'
import { EditButton } from '@/components/ui/edit-button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ReactSelect } from '@/components/ui/react-select'
import { Category, ItemOverview } from '@/types/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Save, Trash2, X } from 'lucide-react'
import React from 'react'
import { z } from 'zod'
import { useSubstitutionGroupColumns } from '@/components/substitution-groups-table-columns'

const searchSchema = z.object({
  category: z.number().min(1).optional().catch(undefined)
})

export const Route = createFileRoute('/_auth/shops/$shopId/items')({
  beforeLoad: () => ({ title: "Items" }),
  validateSearch: (search) => searchSchema.parse(search),
  component: ItemsComponent
})

function ItemsComponent() {
  const { category } = Route.useSearch()
  const nav = Route.useNavigate();
  const { shopId } = Route.useParams();
  const { data: items } = useSuspenseQuery(getShopItemsQueryOptions(shopId))
  const categories = useGetShopCategories(shopId);

  const [selectedCategory, setSelectedCategory] = React.useState<Category | undefined>(categories.find(c => c.id === category));
  const [editing, setEditing] = React.useState(false);
  const { form, onSubmit } = useCategoryForm({ shopId, category: selectedCategory, index: selectedCategory?.index })

  const onCategoryChange = (category?: Category) => {
    nav({ search: { category: category?.id } })
    setSelectedCategory(category)
  }
  const deleteCategory = useDeleteCategory()
  const onError = useOnErrorToast()
  const onSuccess = useOnSuccessToast()

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
      setEditing(false)
    } catch (e) { }
  })

  const { data: substitutions } = useSuspenseQuery(getShopSubstitutionsQueryOptions(shopId))
  const substitutionGroupCols = useSubstitutionGroupColumns(shopId)

  return <div className='flex flex-col items-start gap-2'>
    <Form {...form}>
      <form onSubmit={handleSubmit} autoComplete='off'>
        <div className='flex flex-col items-start gap-2'>
          <div className='flex flex-row flex-wrap gap-2'>
            {!editing && <CategoryFormDialog shopId={shopId} items={items}><CreateButton disabled={editing}>Create Category</CreateButton></CategoryFormDialog>}
            {!editing && <ItemFormDialog shopId={shopId} categories={categories} substitutions={substitutions} addons={items}><CreateButton disabled={editing}>Create Item</CreateButton></ItemFormDialog>}
            {!editing && <EditButton disabled={!selectedCategory} onClick={() => setEditing(true)}> Edit Category</EditButton>}
            {editing && <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder={selectedCategory?.name} />
                    </FormControl>
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="item_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ReactSelect
                        {...field}
                        isMulti
                        options={items}
                        getOptionValue={(i) => { const item = i as ItemOverview; return item.id.toString() }}
                        getOptionLabel={(i) => { const item = i as ItemOverview; return item.name }}
                        controlShouldRenderValue={false}
                        placeholder="+ Add Item"
                        isClearable={false}
                        backspaceRemovesValue={false}
                        className='min-w-48'
                      />
                    </FormControl>
                  </FormItem>
                )} />
            </>
            }
            {editing && <DialogDeleteForm
              title="Delete Category?"
              onDelete={async () => {

                deleteCategory.mutate({ shopId, categoryId: selectedCategory!.id }, {
                  onError,
                  onSuccess: () => {
                    onSuccess("Successfully deleted category.")
                    setEditing(false)
                    setSelectedCategory(undefined)
                  }
                })
              }} />}
            {editing && <Button className='gap-2' type='reset' variant='outline' onClick={() => { form.reset(); setEditing(false) }}><X className='w-4 h-4' />  Discard Changes</Button>}
            {editing && <Button className='gap-2'><Save className='w-4 h-4' />  Save Changes</Button>}
          </div>
          <CategoryTabSelect categories={categories} value={selectedCategory} onValueChange={onCategoryChange} disabled={editing} />
          <div className='grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2'>
            {!selectedCategory && items.map(item => (
              <Link to='/shops/$shopId/items/$itemId' params={{ shopId, itemId: item.id }} key={item.id}><Button variant="secondary" className='min-w-32 w-full' type='button'>{item.name}</Button></Link>
            ))}
            <FormField
              control={form.control}
              name="item_ids"
              render={({ field }) => (
                <SortableInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!editing}
                  render={(item) => (
                    <Link key={item.id} to='/shops/$shopId/items/$itemId' params={{ shopId, itemId: item.id }} disabled={editing}><Button variant="secondary" className='min-w-32 w-full' type='button'>{item.name}</Button></Link>
                  )}
                  trashComponent={<div className='min-h-32 h-full col-span-full outline-dashed outline-destructive flex items-center justify-center text-destructive'><div><Trash2 className='m-auto stroke-destructive w-6 h-6' />Remove from category</div></div>}
                />
              )}
            />
          </div>
        </div>
      </form >
    </Form >
    <div className='flex flex-row flex-wrap items-start gap-4'>
      <Card className='row-span-3'>
        <CardHeader>
          <CardTitle>Substitution Groups</CardTitle>
          <CardDescription>Manage substitution groups to add to items.</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col max-h-96'>
          <DataTable columns={substitutionGroupCols} data={substitutions} />
        </CardContent>
        <CardFooter>
          <SubstitutionGroupFormDialog shopId={shopId} items={items}>
            <CreateButton> Create Substitution Group</CreateButton>
          </SubstitutionGroupFormDialog>
        </CardFooter>
      </Card>
      <Outlet />
    </div>
  </div >
}
