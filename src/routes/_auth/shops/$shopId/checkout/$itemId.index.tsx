import { getShopItemForIdQueryOptions } from '@/api/items'
import { OrderFormDialog } from '@/components/forms/order-form'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  modal: z.boolean().catch(false),
  tabId: z.number().min(1),
})

export const Route = createFileRoute('/_auth/shops/$shopId/checkout/$itemId/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: ItemCheckoutComponent
})

function ItemCheckoutComponent() {
  const { modal, tabId } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { shopId, itemId } = Route.useParams()
  const { data: item } = useSuspenseQuery(getShopItemForIdQueryOptions(shopId, itemId))

  return <OrderFormDialog shopId={shopId} tabId={tabId} item={item} open={modal} onOpenChange={(open) => {
    navigate({ search: { modal: open, tabId }, mask: { to: '/shops/$shopId/checkout', params: { shopId }, unmaskOnReload: true }, replace: true })
  }} />
}
