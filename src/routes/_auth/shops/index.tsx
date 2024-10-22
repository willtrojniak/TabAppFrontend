import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import { ShopFormDialog } from '@/components/forms/shop-form';
import { PaymentMethod } from '@/types/types';
import { CreateButton } from '@/components/ui/create-button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ensureShops, getShopsQueryOptions } from '@/api/shops';

export const Route = createFileRoute('/_auth/shops/')({
  component: ShopsComponent,
  loader: ({ context }) => {
    return ensureShops(context.queryClient, { isMember: true });
  },
})

function ShopsComponent() {
  const { data: memberShops } = useSuspenseQuery(getShopsQueryOptions({ isMember: true, isPending: false }))
  return <div className='flex flex-col items-center gap-4 max-w-full'>
    {memberShops.length === 0 &&
      <>
        <ShopFormDialog paymentMethods={[PaymentMethod.in_person, PaymentMethod.chartstring]}>
          <CreateButton>Create Shop</CreateButton>
        </ShopFormDialog>
        No shops to display. Create one to get started.
      </>
    }
    <div className='flex flex-row flex-wrap gap-4'>
      {memberShops.map((shop) => <Card key={shop.id}>
        <CardHeader><CardTitle>{shop.name}</CardTitle></CardHeader>
        <CardFooter><Link to='/shops/$shopId' params={{ shopId: shop.id }}><Button className='gap-2'>Go to shop<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
      </Card>)}
    </div>
  </div>
}
