import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import { ShopFormDialog } from '@/components/forms/shop-form';
import { PaymentMethod } from '@/types/types';
import { CreateButton } from '@/components/ui/create-button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ensureShops, getShopsQueryOptions, useAcceptShopInvite, useRemoveShopInvite } from '@/api/shops';

export const Route = createFileRoute('/_auth/shops/')({
  component: ShopsComponent,
  loader: ({ context }) => {
    return ensureShops(context.queryClient, { isMember: true });
  },
})

function ShopsComponent() {
  const { user } = Route.useRouteContext();
  const { data: memberShops } = useSuspenseQuery(getShopsQueryOptions({ isMember: true, isPending: false }))
  const { data: invitedShops } = useSuspenseQuery(getShopsQueryOptions({ isMember: true, isPending: true }))
  const acceptInvite = useAcceptShopInvite()
  const rejectInvite = useRemoveShopInvite()
  return <div className='flex flex-col items-center gap-8 max-w-full'>
    {memberShops.length === 0 ?
      <>
        <ShopFormDialog paymentMethods={[PaymentMethod.in_person, PaymentMethod.chartstring]}>
          <CreateButton>Create Shop</CreateButton>
        </ShopFormDialog>
        No shops to display. Create one to get started.
      </>
      :
      <div>
        <h2 className='text-lg font-bold mb-2 text-center'> Shops </h2>
        <div className='flex flex-row flex-wrap gap-4'>
          {memberShops.map((shop) => <Card key={shop.id}>
            <CardHeader><CardTitle>{shop.name}</CardTitle></CardHeader>
            <CardFooter><Link to='/shops/$shopId' params={{ shopId: shop.id }}><Button className='gap-2'>Go to shop<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
          </Card>)}
        </div>
      </div>
    }
    <div>
      <h2 className='text-lg font-bold mb-2 text-center'> Invites </h2>
      <div className='flex flex-row flex-wrap gap-4'>
        {invitedShops.length === 0 && <span className='text-muted-foreground'>No pending invites</span>}
        {invitedShops.map((shop) => <Card key={shop.id}>
          <CardHeader><CardTitle>{shop.name}</CardTitle></CardHeader>
          <CardFooter className='flex gap-2'>
            <Button className='gap-2' onClick={() => acceptInvite.mutate({ shopId: shop.id })}>Accept<Check className='w-4 h-4' /></Button>
            <Button className='gap-2' variant='destructive' onClick={() => rejectInvite.mutate({ shopId: shop.id, data: { roles: 1, email: user.email } })}>Reject<Check className='w-4 h-4' /></Button>
          </CardFooter>
        </Card>)}
      </div>
    </div>
  </div>
}
