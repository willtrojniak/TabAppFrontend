import { ensureShopItemForId, getShopItemForIdQueryOptions } from '@/api/items'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/shops/$shopId/items/$itemId')({
  params: {
    parse: (params) => ({
      itemId: z.number().int().parse(Number(params.itemId)),
    }),
    stringify: ({ itemId }) => ({ itemId: itemId.toString() })
  },
  beforeLoad: async ({ context, params }) => {
    const data = await context.queryClient.fetchQuery(getShopItemForIdQueryOptions(params.shopId, params.itemId)).then(data => data).catch(() => {
      throw notFound();
    })
    return {
      title: data.name
    }
  },
  loader: async ({ context, params }) => {
    return await Promise.all([
      await ensureShopItemForId(context.queryClient, params.shopId, params.itemId)
    ])
  },
})
