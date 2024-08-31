import { useOnErrorToast, useOnSuccessToast } from "@/api/toasts";
import { useCreateTab, useUpdateTab } from "@/api/tabs";
import { TabCreate, TabCreateInput, tabCreateSchema } from "@/types/schemas";
import { PaymentMethod, Shop, Tab, VerificationMethod } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Control, useForm } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DateRangeInput } from "../ui/date-range-input";
import { DaysOfWeekInput } from "../ui/days-of-week-input";
import { PriceInput } from "../ui/price-input";
import { Textarea } from "../ui/textarea";
import { SheetForm } from "./sheet-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function getTabDefaults(tab?: Tab) {
  return {
    display_name: tab?.display_name ?? "",
    payment: {
      payment_method: tab?.payment_method ?? "" as PaymentMethod,
      payment_details: tab?.payment_details ?? "",
    },
    organization: tab?.organization ?? "",
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
    verification_list: tab?.verification_list.join(",") ?? "",
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

export function TabFormSheet({ children, shop, tab }: {
  children: React.ReactNode,
  shop: Shop,
  tab?: Tab,
}) {
  const { form, onSubmit, title, desc } = useTabForm({ shopId: shop.id, tab })

  return <SheetForm form={form} title={title} desc={desc} trigger={children} onSubmit={onSubmit} shouldClose={!tab}>
    <TabFormBody control={form.control} shop={shop} />
  </SheetForm>
}

function TabFormBody({ control, shop }: {
  control: Control<TabCreateInput>,
  shop: Shop
}) {

  const verificationOptions = [VerificationMethod.specify, VerificationMethod.email, VerificationMethod.voucher]

  return <>
    <FormField
      control={control}
      name="display_name"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel className="col">Tab Name</FormLabel>
          <FormControl className="col-span-2" >
            <Input {...field} placeholder="Will's Zee's" />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2">How the tab should be identified.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="organization"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Organization</FormLabel>
          <FormControl className="col-span-2">
            <Input {...field} placeholder="RCA" />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2">The name of the organization hosting the tab.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="payment.payment_method"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Payment Method</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl className="col-span-2">
              <SelectTrigger>
                <SelectValue placeholder="Select payment method..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {shop.payment_methods.map(o => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
            </SelectContent>
          </Select>
          <FormDescription className="col-span-2 col-start-2">Choose from one of the shop's supported payment methods.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem >
      )
      } />
    < FormField
      control={control}
      name="payment.payment_details"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Payment Chartstring</FormLabel>
          <FormControl className="col-span-2">
            <Input {...field} placeholder="XXXXX-XXXXX(-XXXXX)" />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2"></FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    < FormField
      control={control}
      name="billing_interval_days"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Billing Interval</FormLabel>
          <Select onValueChange={(v) => field.onChange(parseInt(v))} value={field.value.toString()}>
            <FormControl >
              <SelectTrigger className="col-span-2" >
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
            </SelectContent>
          </Select>
          <FormDescription className="col-span-2 col-start-2">You will receive an itemized invoice at the end of every billing interval.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    < FormField
      control={control}
      name="dates"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Dates</FormLabel>
          <FormControl className="col-span-2">
            <DateRangeInput value={field.value} onChange={field.onChange} />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2">The date range over which the tab should be active.</FormDescription>
        </FormItem>
      )} />
    < FormField
      control={control}
      name="times.daily_start_time"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Daily Start Time</FormLabel>
          <FormControl className="col-span-2">
            <Input type="time" {...field} />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2">The the time at which the tab should start every day.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    < FormField
      control={control}
      name="times.daily_end_time"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Daily End Time</FormLabel>
          <FormControl className="col-span-2">
            <Input type="time" {...field} />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2">The the time at which the tab should end every day.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    < FormField
      control={control}
      name="active_days_of_wk"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Active Days of Week</FormLabel>
          <FormControl className="col-span-2">
            <DaysOfWeekInput value={field.value} onValueChange={field.onChange} />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2">The days of the week on which the tab should be active.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    < FormField
      control={control}
      name="dollar_limit_per_order"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Dollar Limit per Order</FormLabel>
          <FormControl className="col-span-2">
            <PriceInput {...field} />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2">The limit per order placed on the tab.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    < FormField
      control={control}
      name="verification_method"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Verification Method</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl >
              <SelectTrigger className="col-span-2" >
                <SelectValue placeholder="Select verification method..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {verificationOptions.map(o => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
            </SelectContent>
          </Select>
          <FormDescription className="col-span-2 col-start-2">Specify how a person should be verified as part of the tab.</FormDescription>
          <FormMessage className="col-span-2 col-start-2" />
        </FormItem>
      )} />
    < FormField
      control={control}
      name="verification_list"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center">
          <FormLabel>Verified List</FormLabel>
          <FormControl className="col-span-2">
            <Textarea {...field} />
          </FormControl>
          <FormDescription className="col-span-2 col-start-2">List emails of verified users. One email per line.</FormDescription>
        </FormItem>
      )} />
  </>
}
