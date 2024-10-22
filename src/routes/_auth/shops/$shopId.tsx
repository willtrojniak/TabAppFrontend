import { ensureShopForId, ensureShopForIdPermissions, getShopForIdQueryOptions } from '@/api/shops'
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
      ensureShopForIdPermissions(context.queryClient, params.shopId)
    ])
  }

})
