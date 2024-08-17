import { createFileRoute, Link } from '@tanstack/react-router'
import { ensureShops, getShopsQueryOptions } from '@/api/shops'
import { useSuspenseQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/_auth/shops/')({
  component: ShopsComponent,
  loader: ({ context }) => {
    return ensureShops(context.queryClient);
  },
})

function ShopsComponent() {
  const { data } = useSuspenseQuery(getShopsQueryOptions())
  return <div className='flex flex-col items-start gap-4 max-w-full'>
    {data.map((e) => <Link key={e.id} to="/shops/$shopId" params={{ shopId: e.id }}>{e.name}</Link>)}
  </div>
}
