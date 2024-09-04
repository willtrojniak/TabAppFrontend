import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShopFormCard } from '@/components/forms/shop-form'
import { PaymentMethod } from '@/types/types'
import { getShopForIdQueryOptions } from '@/api/shops'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_auth/shops/$shopId/')({
  component: ShopComponent
})

function ShopComponent() {
  const { shopId } = Route.useParams();
  const { data: shop } = useSuspenseQuery(getShopForIdQueryOptions(shopId))


  return <div className='flex flex-col items-start gap-4 max-w-full'>
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 '>
      <Card className='row-span-1 col-start-1'>
        <CardHeader className='pb-3'>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Add orders onto tabs.</CardDescription>
        </CardHeader>
        <CardFooter><Link to='/shops/$shopId/checkout' params={{ shopId }}><Button className='gap-2'>Go to checkout<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
      </Card>
      <Card className='row-span-1 col-start-1 row-start-2'>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Manage items and categories.</CardDescription>
        </CardHeader>
        <CardFooter><Link to='/shops/$shopId/items' params={{ shopId }}><Button className='gap-2'>Go to items<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
      </Card>
      <Card className='row-span-1 col-start-1 row-start-3'>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Search through, manage, and create tabs.</CardDescription>
        </CardHeader>
        <CardFooter><Link to='/shops/$shopId/tabs' params={{ shopId }}><Button className='gap-2'>Go to tabs<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
      </Card>
      <div className='row-span-3'><ShopFormCard shop={shop} paymentMethods={[PaymentMethod.in_person, PaymentMethod.chartstring]} /></div>
    </div>
  </div >
}
