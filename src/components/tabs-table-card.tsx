import { Shop, TabOverview } from "@/types/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { TabTable } from "./tables/tab-table"

type PropsType = Omit<React.ComponentPropsWithoutRef<typeof Card>, "children"> & {
  tabs: TabOverview[],
  shop: Shop
}

export function TabsTableCard({ shop, tabs, ...props }: PropsType) {

  return <Card {...props}>
    <CardHeader>
      <CardTitle>Tabs</CardTitle>
      <CardDescription>Search through and manage tabs.</CardDescription>
    </CardHeader>
    <CardContent>
      <TabTable tabs={tabs} shopId={shop.id} />
    </CardContent>
  </Card >
}
