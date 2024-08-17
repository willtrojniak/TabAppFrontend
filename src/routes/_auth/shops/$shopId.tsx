import { ensureShopCategories } from '@/api/categories'
import { ensureShopItems } from '@/api/items'
import { ensureShopForId, getShopForIdQueryOptions } from '@/api/shops'
import { ensureShopSubstitutions } from '@/api/substitutions'
import { ensureShopTabs } from '@/api/tabs'
import { createFileRoute, notFound } from '@tanstack/react-router'
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
      ensureShopCategories(context.queryClient, params.shopId),
      ensureShopSubstitutions(context.queryClient, params.shopId),
      ensureShopItems(context.queryClient, params.shopId),
      ensureShopTabs(context.queryClient, params.shopId)
    ])
  }

})
