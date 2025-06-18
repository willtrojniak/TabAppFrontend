import { ensureShopForId, getShopForIdQueryOptions } from '@/api/shops'
import { NavigationMenu, NavigationMenuList } from '@/components/ui/navigation-menu'
import { NavigationMenuLink } from '@radix-ui/react-navigation-menu'
import { createFileRoute, Link, notFound, Outlet } from '@tanstack/react-router'
import { Coins } from 'lucide-react'
import React from 'react'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/shops/$shopId')({
  params: {
    parse: (params) => ({
      shopId: z.number().int().parse(Number(params.shopId)),
    }),
    stringify: ({ shopId }) => ({ shopId: `${shopId}` })
  },
  beforeLoad: async ({ context, params }) => {
    const data = await context.queryClient.fetchQuery(getShopForIdQueryOptions(params.shopId)).then(data => data).catch(() => {
      throw notFound();
    })
    return {
      title: data.name
    }
  },
  loader: async ({ context, params }) => {
    return await Promise.all([
      ensureShopForId(context.queryClient, params.shopId),
    ])
  },
  component: ShopLayoutComponent

})

function ShopLayoutComponent() {
  const { shopId } = Route.useParams();

  return <React.Fragment>
    <Outlet />
    <NavigationMenu className='fixed right-4 bottom-4 sm:bottom-[unset] sm:top-4 z-10'>
      <NavigationMenuList>
        <NavigationMenuLink asChild className="">
          <Link to='/shops/$shopId/checkout' params={{ shopId }}
            className='text-sm border p-2 rounded-sm bg-background'>
            Checkout <Coins className='inline size-4' />
          </Link>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  </React.Fragment>

}
