import { createFileRoute, Link } from '@tanstack/react-router'
import { ensureShopsForUserId, getShopsForUserIdQueryOptions } from '@/api/shops'
import { useSuspenseQuery } from '@tanstack/react-query';
import { ShopFormDialog } from '@/components/forms/shop-form';
import { PaymentMethod } from '@/types/types';
import { CreateButton } from '@/components/ui/create-button';
import { useAuth } from '@/providers/auth';

export const Route = createFileRoute('/_auth/shops/')({
  component: ShopsComponent,
  loader: ({ context }) => {
    return ensureShopsForUserId(context.queryClient, context.user.id);
  },
})

function ShopsComponent() {
  const { user } = useAuth();
  const { data } = useSuspenseQuery(getShopsForUserIdQueryOptions(user!.id))
  return <div className='flex flex-col items-start gap-4 max-w-full'>
    <ShopFormDialog paymentMethods={[PaymentMethod.in_person, PaymentMethod.chartstring]}>
      <CreateButton>Create Shop</CreateButton>
    </ShopFormDialog>
    {data.length === 0 && "No shops to display. Create one to get started."}
    {data.map((e) => <Link key={e.id} to="/shops/$shopId" params={{ shopId: e.id }}>{e.name}</Link>)}
  </div>
}
