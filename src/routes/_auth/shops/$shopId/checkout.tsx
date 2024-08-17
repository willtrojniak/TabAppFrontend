import { useGetShopCategories } from '@/api/categories';
import { getShopTabsQueryOptions } from '@/api/tabs';
import { CategoryTabSelect } from '@/components/category-items';
import { TabCheckoutTable } from '@/components/tables/tab-checkout-table';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Category, TabOverview } from '@/types/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import React, { Suspense } from 'react';

export const Route = createFileRoute('/_auth/shops/$shopId/checkout')({
  beforeLoad: () => {
    return { title: "Checkout" }
  },
  component: CheckoutComponent
})

function CheckoutComponent() {
  const { shopId } = Route.useParams();
  const categories = useGetShopCategories(shopId);
  const { data: tabs } = useSuspenseQuery(getShopTabsQueryOptions(shopId))

  const [selectedCategory, setSelectedCategory] = React.useState<Category | undefined>(categories[0])
  const [selectedTab, setSelectedTab] = React.useState<TabOverview>()

  return <ResizablePanelGroup direction='horizontal' >
    <ResizablePanel defaultSize={33} className='@container py-2'>
      <div className='flex flex-col gap-2 items-start'>
        <CategoryTabSelect value={selectedCategory} onValueChange={setSelectedCategory} categories={categories} allowNone={false} />

        <div className='grid  grid-cols-2 @md:grid-cols-3 @xl:grid-cols-4 @3xl:grid-cols-5 @4xl:grid-cols-6 gap-2'>
          {selectedCategory?.items.map(i => (
            <Link
              key={i.id}
              disabled={!selectedTab}
              to='/shops/$shopId/checkout/$itemId'
              params={{ shopId, itemId: i.id }}
              search={{ modal: true, tabId: selectedTab?.id! }}
              mask={{ to: '/shops/$shopId/checkout', params: { shopId }, unmaskOnReload: true }}
              replace={true}
            >
              <Button disabled={!selectedTab} className='w-fit min-w-full max-w-34' variant="secondary">{i.name}</Button>
            </Link>
          ))}
          {selectedCategory?.items.length === 0 && <div className='text-muted-foreground text-sm whitespace-nowrap'>No items to display</div>}
          {!selectedCategory && <div className='text-muted-foreground text-sm whitespace-nowrap'>No category selected</div>}
        </div>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={67} className='py-2' >
      <Suspense fallback={"Loading"}>
        <div className='flex flex-col items-start px-6'>
          <TabCheckoutTable shopId={shopId} data={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <Outlet />
        </div>
      </Suspense>
    </ResizablePanel>

  </ResizablePanelGroup >
}
