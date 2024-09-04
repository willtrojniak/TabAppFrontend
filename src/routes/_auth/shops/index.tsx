import { createFileRoute, Link } from '@tanstack/react-router'
import { ensureShopsForUserId, getShopsForUserIdQueryOptions } from '@/api/shops'
import { useSuspenseQuery } from '@tanstack/react-query';
import { ShopFormDialog } from '@/components/forms/shop-form';
import { PaymentMethod } from '@/types/types';
import { CreateButton } from '@/components/ui/create-button';
import { useAuth } from '@/providers/auth';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_auth/shops/')({
  component: ShopsComponent,
  loader: ({ context }) => {
    return ensureShopsForUserId(context.queryClient, context.user.id);
  },
})

function ShopsComponent() {
  const { user } = useAuth();
  const { data } = useSuspenseQuery(getShopsForUserIdQueryOptions(user!.id))
  return <div className='flex flex-col items-center gap-4 max-w-full'>
    {data.length === 0 &&
      <ShopFormDialog paymentMethods={[PaymentMethod.in_person, PaymentMethod.chartstring]}>
        <CreateButton>Create Shop</CreateButton>
      </ShopFormDialog>
    }
    {data.length === 0 && "No shops to display. Create one to get started."}
    <div className='flex flex-row flex-wrap gap-4'>
      {data.map((shop) => <Card key={shop.id}>
        <CardHeader><CardTitle>{shop.name}</CardTitle></CardHeader>
        <CardFooter><Link to='/shops/$shopId' params={{ shopId: shop.id }}><Button className='gap-2'>Go to shop<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
      </Card>)}
    </div>
  </div>
}
