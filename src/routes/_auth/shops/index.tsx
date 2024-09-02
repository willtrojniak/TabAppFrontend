import { createFileRoute, Link } from '@tanstack/react-router'
import { ensureShops, getShopsQueryOptions } from '@/api/shops'
import { useSuspenseQuery } from '@tanstack/react-query';
import { ShopFormDialog } from '@/components/forms/shop-form';
import { PaymentMethod } from '@/types/types';
import { CreateButton } from '@/components/ui/create-button';

export const Route = createFileRoute('/_auth/shops/')({
  component: ShopsComponent,
  loader: ({ context }) => {
    return ensureShops(context.queryClient);
  },
})

function ShopsComponent() {
  const { data } = useSuspenseQuery(getShopsQueryOptions())
  return <div className='flex flex-col items-start gap-4 max-w-full'>
    <ShopFormDialog paymentMethods={[PaymentMethod.in_person, PaymentMethod.chartstring]}>
      <CreateButton>Create Shop</CreateButton>
    </ShopFormDialog>
    {data.length === 0 && "No shops to display. Create one to get started."}
    {data.map((e) => <Link key={e.id} to="/shops/$shopId" params={{ shopId: e.id }}>{e.name}</Link>)}
  </div>
}
