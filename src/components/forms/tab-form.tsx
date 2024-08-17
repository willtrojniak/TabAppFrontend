import { useOnErrorToast, useOnSuccessToast } from "@/api/toasts";
import { useCreateTab, useUpdateTab } from "@/api/tabs";
import { TabCreate, TabCreateInput, tabCreateSchema } from "@/types/schemas";
import { PaymentMethod, Tab, VerificationMethod } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Control, useForm } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DialogForm } from "./dialog-form";
import { DateRangeInput } from "../ui/date-range-input";

function getTabDefaults(tab?: Tab) {
  return {
    display_name: tab?.display_name ?? "",
    payment_method: tab?.payment_method ?? PaymentMethod.chartstring,
    organization: tab?.organization ?? "",
    dates: { from: tab?.start_date ?? "", to: tab?.end_date ?? "" },
    daily_end_time: tab?.daily_end_time ?? "",
    daily_start_time: tab?.daily_start_time ?? "",
    billing_interval_days: tab?.billing_interval_days ?? 365,
    payment_details: tab?.payment_details ?? "",
    verification_list: tab?.verification_list.join(",") ?? "",
    verification_method: tab?.verification_method ?? VerificationMethod.specify,
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

export function TabFormDialog({ children, shopId, tab }: {
  children: React.ReactNode,
  shopId: number,
  tab?: Tab,
}) {
  const { form, onSubmit, title, desc } = useTabForm({ shopId, tab })

  return <DialogForm form={form} title={title} desc={desc} trigger={children} onSubmit={onSubmit} shouldClose={!tab}>
    <TabFormBody control={form.control} />
  </DialogForm>
}

function TabFormBody({ control, }: {
  control: Control<TabCreateInput>
}) {
  return <>
    <FormField
      control={control}
      name="display_name"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tab Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Will's Zee's" />
          </FormControl>
          <FormDescription>How the tab should be identified.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="organization"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Organization</FormLabel>
          <FormControl>
            <Input {...field} placeholder="RCA" />
          </FormControl>
          <FormDescription>The name of the organization hosting the tab.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="dates"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dates</FormLabel>
          <FormControl>
            <DateRangeInput value={field.value} onChange={field.onChange} />
          </FormControl>
          <FormDescription>The date range over which the tab should be active.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="daily_start_time"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Daily Start Time</FormLabel>
          <FormControl>
            <Input type="time" {...field} placeholder="RCA" />
          </FormControl>
          <FormDescription>The the time at which the tab should start every day.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="daily_end_time"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Daily End Time</FormLabel>
          <FormControl>
            <Input type="time" {...field} placeholder="RCA" />
          </FormControl>
          <FormDescription>The time at which the tab should end every day.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
  </>
}
