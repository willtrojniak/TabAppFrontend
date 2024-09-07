import { useOnErrorToast, useOnSuccessToast } from "@/api/toasts";
import { useCreateTab, useUpdateTab } from "@/api/tabs";
import { TabCreate, TabCreateInput, tabCreateSchema } from "@/types/schemas";
import { LocationOverview, PaymentMethod, Shop, Tab, VerificationMethod } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Control, useForm, useWatch } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DateRangeInput } from "../ui/date-range-input";
import { DaysOfWeekInput } from "../ui/days-of-week-input";
import { PriceInput } from "../ui/price-input";
import { Textarea } from "../ui/textarea";
import { SheetForm } from "./sheet-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CardForm } from "./card-form";
import { ReactSelect } from "../ui/react-select";

function getTabDefaults(tab?: Tab) {
  return {
    display_name: tab?.display_name ?? "",
    payment: {
      payment_method: tab?.payment_method ?? "" as PaymentMethod,
      payment_details: tab?.payment_details ?? "",
    },
    organization: tab?.organization ?? "",
    location_ids: tab?.locations ?? [],
    dates: {
      from: tab?.start_date ?? "",
      to: tab?.end_date ?? ""
    },
    times: {
      daily_start_time: tab?.daily_start_time ?? "",
      daily_end_time: tab?.daily_end_time ?? "",
    },
    active_days_of_wk: tab?.active_days_of_wk ?? 0,
    billing_interval_days: tab?.billing_interval_days ?? 0,
    verification_list: tab?.verification_list?.join("\n") ?? "",
    verification_method: tab?.verification_method ?? "" as VerificationMethod,
    dollar_limit_per_order: tab?.dollar_limit_per_order ?? 0
  } satisfies TabCreateInput
}

export function useTabForm({ shopId, tab }: {
  shopId: number
  tab?: Tab
}) {
  const form = useForm<TabCreateInput>({
    resolver: zodResolver(tabCreateSchema),
    mode: "onSubmit",
    shouldUseNativeValidation: false,
    reValidateMode: "onChange",
    defaultValues: getTabDefaults(tab)
  })

  const createTab = useCreateTab()
  const updateTab = useUpdateTab()
  const onError = useOnErrorToast()
  const onSuccess = useOnSuccessToast()

  React.useEffect(() => {
    form.reset(getTabDefaults(tab))
  }, [tab])

  const start_time = form.watch("times.daily_start_time");
  React.useEffect(() => {
    if (form.formState.isSubmitted) form.trigger("times.daily_end_time")
  }, [start_time])

  const payment_method = form.watch("payment.payment_method");
  React.useEffect(() => {
    if (form.formState.isSubmitted) form.trigger("payment.payment_details")
  }, [payment_method])


  const onSubmit = React.useCallback(async (v: unknown) => {
    const data = v as TabCreate
    if (!tab?.id) {
      await createTab.mutateAsync({ shopId, data }, {
        onSuccess: (_, { data }) => onSuccess(`Successfully created tab '${data.display_name}'.`),
        onError,
      })
    } else {
      await updateTab.mutateAsync({ shopId, tabId: tab.id, data }, {
        onSuccess: (_, { data }) => onSuccess(`Successfully updated tab '${data.display_name}'.`),
        onError,
      })
    }
  }, [shopId, tab?.id])
  const title = !tab?.id ? "Submit a tab request" : "Edit a tab request"
  const desc = !tab?.id ? "Create a new tab request." : "Make changes to an existing tab request."

  return { form, onSubmit, title, desc }
}

export function TabFormCard({ shop, tab }: {
  shop: Shop,
  tab?: Tab,
}) {
  const { form, onSubmit, title, desc } = useTabForm({ shopId: shop.id, tab })

  return <CardForm form={form} title={title} desc={desc} onSubmit={onSubmit} >
    <TabFormBody control={form.control} shop={shop} tab={tab} />
  </CardForm>

}

export function TabFormSheet({ children, shop, tab }: {
  children: React.ReactNode,
  shop: Shop,
  tab?: Tab,
}) {
  const { form, onSubmit, title, desc } = useTabForm({ shopId: shop.id, tab })

  return <SheetForm form={form} title={title} desc={desc} trigger={children} onSubmit={onSubmit} >
    <TabFormBody control={form.control} shop={shop} tab={tab} />
  </SheetForm>
}

function TabFormBody({ control, shop, tab }: {
  control: Control<TabCreateInput>,
  tab?: Tab,
  shop: Shop
}) {

  const verificationOptions = [VerificationMethod.specify, VerificationMethod.email, VerificationMethod.voucher]
  const paymentMethod = useWatch({ control, name: "payment.payment_method" })
  const verificationMethod = useWatch({ control, name: "verification_method" })

  return <>
    <FormField
      control={control}
      name="display_name"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Tab Name</FormLabel>
            <FormDescription>How the tab is identified.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormControl>
              <Input {...field} placeholder="Will's Zee's" />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )} />
    <FormField
      control={control}
      name="organization"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Organization</FormLabel>
            <FormDescription>The organization sponsoring the tab.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormControl >
              <Input {...field} placeholder="RCA" />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )} />
    <FormField
      control={control}
      name="payment.payment_method"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Payment Method</FormLabel>
            <FormDescription>Choose from one of the shop's supported payment methods.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {shop.payment_methods.map(o => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        </FormItem >
      )
      } />
    < FormField
      control={control}
      name="payment.payment_details"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          {paymentMethod === PaymentMethod.chartstring &&
            <>
              <div className="col">
                <FormLabel>Chartstring</FormLabel>
                <FormDescription>The chartstring to bill to.</FormDescription>
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <FormControl >
                  <Input {...field} placeholder="XXXXX-XXXXX(-XXXXX)" />
                </FormControl>
                <FormMessage />
              </div>
            </>
          }
        </FormItem>
      )} />
    < FormField
      control={control}
      name="billing_interval_days"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Billing Interval</FormLabel>
            <FormDescription >You will receive an itemized invoice at the end of every billing interval and after the final day of the tab.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value.toString()}>
              <FormControl >
                <SelectTrigger >
                  <SelectValue placeholder="Select billing interval..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0" disabled>Select billing interval...</SelectItem>
                <SelectItem value="1">Daily (1 Day)</SelectItem>
                <SelectItem value="7">Weekly (7 Days)</SelectItem>
                <SelectItem value="14">Biweekly (14 Days)</SelectItem>
                <SelectItem value="30">Monthly (30 Days)</SelectItem>
                <SelectItem value="91">Quarterly (91 Days)</SelectItem>
                <SelectItem value="182">Biannually (182 Days)</SelectItem>
                <SelectItem value="365">Annually (365 Days)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="col-span-2 col-start-2" />
          </div>
        </FormItem>
      )} />
    <FormField
      control={control}
      name="location_ids"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Locations</FormLabel>
            <FormDescription>Choose which shop locations will host the tab. Cannot be changed.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormControl>
              <ReactSelect
                {...field}
                isMulti
                isDisabled={!!tab?.id}
                options={shop.locations}
                getOptionValue={(o) => { const location = o as LocationOverview; return location.id.toString() }}
                getOptionLabel={(o) => { const location = o as LocationOverview; return location.name }}
              />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )} />
    < FormField
      control={control}
      name="dates"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Dates</FormLabel>
            <FormDescription >The date range over which the tab should be active.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormControl >
              <DateRangeInput value={field.value} onChange={field.onChange} />
            </FormControl>
          </div>
        </FormItem>
      )} />
    < FormField
      control={control}
      name="times.daily_start_time"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Daily Start Time</FormLabel>
            <FormDescription >The the time at which the tab should start every day.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormControl >
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )} />
    < FormField
      control={control}
      name="times.daily_end_time"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Daily End Time</FormLabel>
            <FormDescription >The the time at which the tab should end every day.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormControl >
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )} />
    < FormField
      control={control}
      name="active_days_of_wk"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Active Days of Week</FormLabel>
            <FormDescription >The days of the week on which the tab should be active.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormControl >
              <DaysOfWeekInput value={field.value} onValueChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )} />
    < FormField
      control={control}
      name="dollar_limit_per_order"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Dollar Limit per Order</FormLabel>
            <FormDescription >The limit per order placed on the tab.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <FormControl >
              <PriceInput {...field} />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )} />
    < FormField
      control={control}
      name="verification_method"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          <div className="col">
            <FormLabel>Verification Method</FormLabel>
            <FormDescription >Specify how a person should be verified as part of the tab.</FormDescription>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl >
                <SelectTrigger >
                  <SelectValue placeholder="Select verification method..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {verificationOptions.map(o => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        </FormItem>
      )} />
    < FormField
      control={control}
      name="verification_list"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid md:grid-cols-3 gap-2 items-start">
          {verificationMethod === VerificationMethod.email && <>
            <div className="col">
              <FormLabel>Verified List</FormLabel>
              <FormDescription >List emails of verified users. One email per line.</FormDescription>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <FormControl >
                <Textarea {...field} placeholder="john.doe@example.com&#10;jane.doe@example.com" />
              </FormControl>
            </div>
          </>}
        </FormItem>
      )} />
  </>
}
