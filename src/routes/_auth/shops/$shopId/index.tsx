import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/data-table'
import { useTabColumns } from '@/components/tab-table-columns'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useItemColumns } from '@/components/item-table-columns'
import { ItemFormDialog } from '@/components/forms/item-form'
import { ShopFormCard } from '@/components/forms/shop-form'
import { PaymentMethod } from '@/types/types'
import { useSubstitutionGroupColumns } from '@/components/substitution-groups-table-columns'
import { SubstitutionGroupFormDialog } from '@/components/forms/substitution-group-form'
import { CreateButton } from '@/components/ui/create-button'
import { getShopForIdQueryOptions } from '@/api/shops'
import { useGetShopCategories } from '@/api/categories'
import { getShopSubstitutionsQueryOptions } from '@/api/substitutions'
import { getShopItemsQueryOptions } from '@/api/items'
import { getShopTabsQueryOptions } from '@/api/tabs'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TabFormSheet } from '@/components/forms/tab-form'

export const Route = createFileRoute('/_auth/shops/$shopId/')({
  component: ShopComponent
})

function ShopComponent() {
  const { shopId } = Route.useParams();
  const { data: shop } = useSuspenseQuery(getShopForIdQueryOptions(shopId))
  const categories = useGetShopCategories(shopId);
  const { data: substitutions } = useSuspenseQuery(getShopSubstitutionsQueryOptions(shopId))
  const { data: items } = useSuspenseQuery(getShopItemsQueryOptions(shopId))
  const { data: tabs } = useSuspenseQuery(getShopTabsQueryOptions(shopId))

  const itemCols = useItemColumns(shopId)
  const substitutionGroupCols = useSubstitutionGroupColumns(shopId)
  const tabCols = useTabColumns(shopId)

  return <div className='flex flex-col items-start gap-4 max-w-full'>
    <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 '>
      <Card className='row-span-1 col-start-1'>
        <CardHeader className='pb-3'>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Add item orders onto tabs.</CardDescription>
        </CardHeader>
        <CardFooter><Link to='/shops/$shopId/checkout' params={{ shopId }}><Button className='gap-2'>Go to checkout<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
      </Card>
      <div className='row-span-2 row-start-2'><ShopFormCard shop={shop} paymentMethods={[PaymentMethod.in_person, PaymentMethod.chartstring]} /></div>
      <Card className='row-span-3'>
        <CardHeader>
          <CardTitle><Link to='/shops/$shopId/items' params={{ shopId }} className='hover:underline underline-offset-4'>Items <ExternalLink className='w-4 h-4 mb-2 inline' /></Link></CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col max-h-96'>
            <DataTable columns={itemCols} data={items} />
          </div>
        </CardContent>
        <CardFooter>
          <ItemFormDialog shopId={shopId} categories={categories} addons={items} substitutions={substitutions}>
            <CreateButton>Create Item</CreateButton>
          </ItemFormDialog>
        </CardFooter>
      </Card>
      <Card className='row-span-3'>
        <CardHeader>
          <CardTitle>Substitution Groups</CardTitle>
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
    </div>
    <Card className='w-full max-w-full overflow-x-auto'>
      <CardHeader>
        <CardTitle>Tabs</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={tabCols} data={tabs} />
      </CardContent>
      <CardFooter>
        <TabFormSheet shop={shop}>
          <CreateButton>Create Tab</CreateButton>
        </TabFormSheet>
      </CardFooter>
    </Card>
  </div >
}
