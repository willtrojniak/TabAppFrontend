import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShopFormCard } from '@/components/forms/shop-form'
import { PaymentMethod } from '@/types/types'
import { getShopForIdQueryOptions, getShopPermissionsForIdQueryOptions, getShopUsersForIdQueryOptions } from '@/api/shops'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocationColumns } from '@/components/location-table-columns'
import { DataTable } from '@/components/data-table'
import { LocationFormDialog } from '@/components/forms/location-form'
import { CreateButton } from '@/components/ui/create-button'
import { hasRoles, shop_roles } from '@/util/shops'
import { useUserColumns } from '@/components/user-table-columns'
import { ShopUserFormDialog } from '@/components/forms/shop-user-form'

export const Route = createFileRoute('/_auth/shops/$shopId/')({
  component: ShopComponent
})

function ShopComponent() {
  const { shopId } = Route.useParams();
  const { data: shop } = useSuspenseQuery(getShopForIdQueryOptions(shopId))
  const { data: roles } = useSuspenseQuery(getShopPermissionsForIdQueryOptions(shopId))
  const { data: users } = useQuery(getShopUsersForIdQueryOptions(shopId))

  const locationCols = useLocationColumns(shopId)
  const userCols = useUserColumns(shopId)


  return <div className='flex flex-col items-start xl:flex-row flex-wrap justify-start gap-4 max-w-full'>
    <div className='flex flex-wrap xl:flex-col items-stretch justify-stretch gap-4'>
      {hasRoles(roles, shop_roles.ROLE_USER_MANAGE_ORDERS) &&
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Add orders onto tabs.</CardDescription>
          </CardHeader>
          <CardFooter><Link to='/shops/$shopId/checkout' params={{ shopId }}><Button className='gap-2'>Go to checkout<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
        </Card>
      }
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Manage items and categories.</CardDescription>
        </CardHeader>
        <CardFooter><Link to='/shops/$shopId/items' params={{ shopId }}><Button className='gap-2'>Go to items<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
      </Card>
      {hasRoles(roles, shop_roles.ROLE_USER_READ_TABS) &&
        <Card >
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Search through, manage, and create tabs.</CardDescription>
          </CardHeader>
          <CardFooter><Link to='/shops/$shopId/tabs' params={{ shopId }}><Button className='gap-2'>Go to tabs<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
        </Card>
      }
    </div>
    {hasRoles(roles, shop_roles.ROLE_USER_OWNER) &&
      <div className='flex flex-wrap gap-4'>
        <div ><ShopFormCard shop={shop} paymentMethods={[PaymentMethod.in_person, PaymentMethod.chartstring]} /></div>
        <Card >
          <CardHeader>
            <CardTitle>Shop Locations</CardTitle>
            <CardDescription>Manage where tabs can be hosted.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={locationCols} data={shop.locations} />
          </CardContent>
          <CardFooter>
            <LocationFormDialog shopId={shopId}>
              <CreateButton> Create Location</CreateButton>
            </LocationFormDialog>
          </CardFooter>
        </Card>
        {users &&
          <Card>
            <CardHeader>
              <CardTitle>Shop Users</CardTitle>
              <CardDescription>Manage users and their permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={userCols} data={users} />
            </CardContent>
            <CardFooter>
              <ShopUserFormDialog shopId={shopId}>
                <CreateButton>Add User</CreateButton>
              </ShopUserFormDialog>
            </CardFooter>
          </Card>
        }
      </div>
    }
  </div >
}
