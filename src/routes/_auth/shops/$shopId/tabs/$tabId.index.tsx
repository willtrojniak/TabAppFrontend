import { createFileRoute } from '@tanstack/react-router'
import { getShopTabForIdQueryOptions, useApproveTab, useCloseBill, useCloseTab } from '@/api/tabs'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, CornerDownRight, Download } from 'lucide-react';
import { Format24hTime, FormatDateMMDDYYYY, GetActiveDayAcronyms } from '@/util/dates';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrencyUSD } from '@/util/currency';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TabFormSheet } from '@/components/forms/tab-form';
import { getShopForIdQueryOptions } from '@/api/shops';
import { EditButton } from '@/components/ui/edit-button';
import { CheckButton } from '@/components/ui/check-button';
import { TabStatus } from '@/types/types';
import { useOnErrorToast, useOnSuccessToast } from '@/api/toasts';
import { ArchiveButton } from '@/components/ui/archive-button';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BillPdf } from '@/components/pdfs/bill-pdf';
import { authorizeTabAction, TabAction } from '@/util/authorization';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';


export const Route = createFileRoute('/_auth/shops/$shopId/tabs/$tabId/')({
  component: TabComponent
})

function TabComponent() {
  const { shopId, tabId } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { data: shop } = useSuspenseQuery(getShopForIdQueryOptions(shopId))
  const { data: tab } = useSuspenseQuery(getShopTabForIdQueryOptions(shopId, tabId))
  const onSuccess = useOnSuccessToast()
  const onError = useOnErrorToast()

  const navigate = Route.useNavigate();

  const closeBill = useCloseBill()
  const handleClose = (shopId: number, tabId: number, billId: number) => {
    closeBill.mutate({ shopId, tabId, billId }, {
      onError,
    })
  }

  const approveTab = useApproveTab()
  const handleApprove = (shopId: number, tabId: number) => {
    approveTab.mutate({ shopId, tabId }, {
      onSuccess: () => onSuccess("Successfully approved tab."),
      onError,
    })
  }

  const closeTab = useCloseTab()
  const handleCloseTab = (shopId: number, tabId: number) => {
    closeTab.mutate({ shopId, tabId }, {
      onSuccess: () => onSuccess("Successfully closed tab."),
      onError,
    })
  }

  return <Dialog open onOpenChange={() => {
    navigate(({ to: '/shops/$shopId/tabs', params: { shopId }, replace: false }))
  }}>
    <DialogContent className='min-w-[90vw]'>
      <DialogHeader className='sticky top-0'><DialogTitle>{tab.display_name}</DialogTitle></DialogHeader>
      <div className='max-h-[60vh] p-1 overflow-y-auto'>
        <div className='flex items-end justify-between'>
          <h3 className='text-lg'>Details</h3>
          <div>
            {authorizeTabAction(user, { shop, tab }, TabAction.UPDATE) &&
              <>
                <TabFormSheet shop={shop} tab={tab}>
                  <EditButton>Edit </EditButton>
                </TabFormSheet>
                <ArchiveButton
                  disabled={closeTab.isPending || tab.status === TabStatus.closed}
                  onClick={() => handleCloseTab(shopId, tabId)}
                >
                  Close
                </ArchiveButton>
                <CheckButton
                  disabled={
                    approveTab.isPending
                    || (tab.status === TabStatus.confirmed && tab.pending_updates === null)
                    || tab.status === TabStatus.closed
                  }
                  onClick={() => handleApprove(shopId, tabId)}
                >
                  Approve
                </CheckButton>
              </>
            }
          </div>
        </div>
        <Separator className='mb-2 mt-0.5' />
        <div className='grid grid-cols-3 gap-4 max-h-[40vh] max-w-full overflow-auto mb-8'>
          <span>Status:</span>
          <span><Badge variant={tab.status === TabStatus.pending ? "default" : "outline"}> {tab.status}</Badge></span>
          <span className='font-bold'>{tab.pending_updates ? "Pending Updates" : "No Updates"}</span>
          <span>Organization:</span>
          <span>{tab.organization}</span>
          <span>{tab.pending_updates?.organization}</span>
          <span>Payment Method:</span>
          <span>{tab.payment_method}</span>
          <span>{tab.pending_updates?.payment_method}</span>
          <span>Payment Details:</span>
          <span>{tab.payment_details}</span>
          <span>{tab.pending_updates?.payment_details}</span>
          <span>Billing Interval:</span>
          <span>{tab.billing_interval_days} day(s)</span>
          <span>{tab.pending_updates?.billing_interval_days} {tab.pending_updates && "day(s)"}</span>
          <span>Location(s):</span>
          <span>{tab.locations.map(loc => loc.name).join(',')}</span>
          <span>{tab.pending_updates?.locations.map(loc => loc.name).join(',')}</span>
          <span>Active Date(s):</span>
          <span>{tab.start_date !== tab.end_date ? `${FormatDateMMDDYYYY(tab.start_date)} - ${FormatDateMMDDYYYY(tab.end_date)}` : FormatDateMMDDYYYY(tab.start_date)}</span>
          <span>{tab.pending_updates?.start_date !== tab.pending_updates?.end_date && tab.pending_updates ? `${FormatDateMMDDYYYY(tab.pending_updates?.start_date)} - ${FormatDateMMDDYYYY(tab.pending_updates.end_date)}` : tab.pending_updates ? FormatDateMMDDYYYY(tab.pending_updates.start_date) : ""}</span>
          <span>Time:</span>
          <span>{Format24hTime(tab.daily_start_time)} - {Format24hTime(tab.daily_end_time)}</span>
          <span>{tab.pending_updates ? `${Format24hTime(tab.pending_updates.daily_start_time)} - ${Format24hTime(tab.pending_updates.daily_end_time)}` : ""}</span>
          <span>Active Days:</span>
          <span>{GetActiveDayAcronyms(tab.active_days_of_wk).join(", ")}</span>
          <span>{tab.pending_updates ? GetActiveDayAcronyms(tab.active_days_of_wk).join(", ") : ""}</span>
          <span>Dollar Limit per Order:</span>
          <span>{formatCurrencyUSD(tab.dollar_limit_per_order)}</span>
          <span>{tab.pending_updates ? formatCurrencyUSD(tab.dollar_limit_per_order) : ""}</span>
          <span>Verification Method:</span>
          <span>{tab.verification_method}</span>
          <span>{tab.pending_updates?.verification_method}</span>
        </div>
        <h3 className='text-lg mb-0.5'>Bills</h3>
        <Separator className='mb-2' />
        {tab.bills.length === 0 && <div>No data to display</div>}
        {tab.bills.map((bill) => {
          let total = 0
          return <Collapsible key={bill.id} className='w-full max-w-full'>
            <CollapsibleTrigger asChild>
              <Button variant='ghost' className='gap-4 mb-2 justify-start'>
                <Badge variant={bill.is_paid ? "secondary" : "destructive"}>{bill.is_paid ? "Paid" : "Unpaid"}</Badge>
                <div className='flex items-center gap-2'>{FormatDateMMDDYYYY(bill.start_date)} - {FormatDateMMDDYYYY(bill.end_date)}<ChevronsUpDown className='w-4 h-4' /></div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='mb-8'>
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
              <div className='flex gap-2 flex-wrap'>
                {authorizeTabAction(user, { shop, tab }, TabAction.CLOSE_BILL) &&
                  <Button onClick={() => handleClose(shopId, tabId, bill.id)} disabled={bill.is_paid}>Mark Paid</Button>
                }
                <PDFDownloadLink document={<BillPdf shop={shop} tab={tab} bill={bill} />} fileName={`${tab.display_name}_${FormatDateMMDDYYYY(bill.start_date)}_${FormatDateMMDDYYYY(bill.end_date)}`}>
                  {({ loading, error }) => {
                    return <Button disabled={!!loading || !!error} className='gap-2' variant="outline"><Download className='w-4 h-4' />{error ? "Error generating file" : loading ? "Loading ..." : "Download"}</Button>
                  }}
                </PDFDownloadLink>
              </div>
            </CollapsibleContent>
          </Collapsible>
        })}
      </div>
    </DialogContent>
  </Dialog >;
}

