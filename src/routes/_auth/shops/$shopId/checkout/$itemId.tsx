import { ensureShopItemForId } from '@/api/items';
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod';

export const Route = createFileRoute('/_auth/shops/$shopId/checkout/$itemId')({
  params: {
    parse: (params) => ({
      itemId: z.number().int().parse(Number(params.itemId)),
    }),
    stringify: ({ itemId }) => ({ itemId: itemId.toString() })
  },
  beforeLoad: async () => {
    return {
      title: ""
    }
  },
  loader: async ({ context, params }) => {
    return await Promise.all([
      await ensureShopItemForId(context.queryClient, params.shopId, params.itemId)
    ])
  },
})
