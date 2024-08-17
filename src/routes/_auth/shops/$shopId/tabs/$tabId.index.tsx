import { createFileRoute } from '@tanstack/react-router'
import { getShopTabForIdQueryOptions, useCloseBill } from '@/api/tabs'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, CornerDownRight } from 'lucide-react';
import { getFormattedDayFromUTC } from '@/util/dates';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrencyUSD } from '@/util/currency';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

export const Route = createFileRoute('/_auth/shops/$shopId/tabs/$tabId/')({
  component: TabComponent
})

function TabComponent() {
  const { shopId, tabId } = Route.useParams();
  const { data: tab } = useSuspenseQuery(getShopTabForIdQueryOptions(shopId, tabId))

  const closeTab = useCloseBill()
  const handleClose = (shopId: number, tabId: number, billId: number) => {
    closeTab.mutate({ shopId, tabId, billId }, {
      onError: () => toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive"
      })
    })

  }

  return <div className='flex flex-col items-start'>
    <Card>
    </Card>
    <Card className='flex flex-col items-start max-w-full overflow-hidden'>
      <CardHeader><CardTitle>Tab Bills</CardTitle></CardHeader>
      <CardContent className='max-w-full flex flex-col items-start gap-6'>
        {tab.bills.map((bill, index, arr) => {
          let total = 0
          return <Collapsible key={bill.id} className='max-w-full'>
            <CollapsibleTrigger asChild className='mb-2'>
              <Button variant='ghost' className='gap-1'>
                <Badge variant={bill.is_paid ? "secondary" : "destructive"}>{bill.is_paid ? "Paid" : "Unpaid"}</Badge>
                {getFormattedDayFromUTC(bill.start_time)} - {index + 1 < arr.length ? getFormattedDayFromUTC(arr[index + 1].start_time) : "Present"}<ChevronsUpDown className='w-4 h-4' /></Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='border rounded-md mb-4 '>
                <Table >
                  <TableHeader className='border-b'>
                    <TableRow>
                      <TableHead colSpan={2}>Item</TableHead>
                      <TableHead className='text-right'>Price</TableHead>
                      <TableHead className='text-right'>Quantity</TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bill.items.map(item => {
                      total += item.base_price * item.quantity
                      return <React.Fragment key={item.id}>
                        <TableRow >
                          <TableCell colSpan={2}>{item.name}</TableCell>
                          <TableCell className='text-right'>{formatCurrencyUSD(item.base_price)}</TableCell>
                          <TableCell className='text-right'>{item.quantity}</TableCell>
                          <TableCell className='text-right'>{formatCurrencyUSD(item.quantity * item.base_price)}</TableCell>
                        </TableRow>
                        {item.variants.map(item => {
                          total += item.price * item.quantity
                          return <TableRow key={`v-${item.id}`}>
                            <TableCell className='text-right text-muted-foreground pr-0'><CornerDownRight className='w-4 h-4' /></TableCell>
                            <TableCell className='text-right'>{item.name}</TableCell>
                            <TableCell className='text-right'>{formatCurrencyUSD(item.price)}</TableCell>
                            <TableCell className='text-right'>{item.quantity}</TableCell>
                            <TableCell className='text-right'>{formatCurrencyUSD(item.quantity * item.price)}</TableCell>
                          </TableRow>
                        })}
                      </React.Fragment>
                    })}
                  </TableBody>
                  <TableFooter className='font-semibold'>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell colSpan={2} className='text-right'>{formatCurrencyUSD(total)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
              <Button onClick={() => handleClose(shopId, tabId, bill.id)} disabled={bill.is_paid}>Mark Paid</Button>
            </CollapsibleContent>
          </Collapsible>
        })}
      </CardContent>
    </Card>
  </div>
}

