import { ensureShopTabForId, getShopTabForIdQueryOptions } from '@/api/tabs'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/shops/$shopId/tabs/$tabId')({
  params: {
    parse: (params) => ({
      tabId: z.number().int().parse(Number(params.tabId)),
    }),
    stringify: ({ tabId }) => ({ tabId: tabId.toString() })
  },
  beforeLoad: async ({ context, params }) => {
    const data = await context.queryClient.fetchQuery(getShopTabForIdQueryOptions(params.shopId, params.tabId)).then(data => data).catch(() => {
      throw notFound();
    })
    return {
      title: data.display_name
    }
  },
  loader: async ({ context, params }) => {
    return await Promise.all([
      await ensureShopTabForId(context.queryClient, params.shopId, params.tabId)
    ])
  },
})
