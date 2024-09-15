import { OrderCreate, OrderCreateRaw, orderCreateSchema } from "@/types/schemas";
import { Item } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { CounterInput } from "../ui/number-input";
import React from "react";
import { useAddOrderToTab, useRemoveOrderFromTab } from "@/api/tabs";
import { toast } from "../ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroupItem } from "@radix-ui/react-radio-group";

function getItemDefaults(item: Item): OrderCreateRaw {
  const data = {
    item: {
      id: item.id,
      variantId: item.variants[0]?.id
    },
    substitutions: item.substitution_groups.filter(group => group.substitutions.length > 0).map(group => ({ id: group.id, itemId: group.substitutions[0].id })),
    addons: item.addons.map(a => ({ id: a.id, quantity: 0 })),
  } satisfies OrderCreateRaw

  return data

}

export function useOrderForm({ shopId, tabId, item }: {
  shopId: number,
  tabId: number,
  item: Item
}) {
  const form = useForm<OrderCreateRaw>({
    resolver: zodResolver(orderCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getItemDefaults(item)
  })

  React.useEffect(() => {
    form.reset(getItemDefaults(item))
  }, [item])

  const addOrder = useAddOrderToTab()
  const removeOrder = useRemoveOrderFromTab()
  const onError = React.useCallback((_: Error) => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "Could not add order to the tab."
    })
  }, [])

  const onSubmit = React.useCallback(async (v: unknown) => {
    const values = v as OrderCreate;
    await addOrder.mutateAsync({ shopId, tabId, data: values }, {
      onSuccess: () => {
        toast({
          title: `Success!`,
          description: `Added order to tab.`,
          duration: 5000
        })
      },
      onError,
    })
  }, [shopId, tabId])

  const onRemove = React.useCallback(async (v: unknown) => {
    const values = v as OrderCreate;
    await removeOrder.mutateAsync({ shopId, tabId, data: values }, {
      onSuccess: () => {
        toast({
          title: `Success!`,
          description: `Removed order from tab.`,
          duration: 5000
        })
      },
      onError,
    })
  }, [shopId, tabId])

  return { form, onSubmit, onRemove };
}

export function OrderFormDialog({ shopId, tabId, item, open, onOpenChange }: {
  shopId: number,
  tabId: number,
  item: Item
  open?: boolean
  onOpenChange?: (isOpen: boolean) => void
}) {
  const { form, onSubmit, onRemove } = useOrderForm({ item, shopId, tabId })
  const submitHandler = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
      onOpenChange?.(false)
    } catch (e) { }
  })

  const removeHandler = form.handleSubmit(async (data) => {
    try {
      await onRemove(data)
      onOpenChange?.(false)
    } catch (e) { }
  })

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{item.name}</DialogTitle>
        <DialogDescription>Confirm the order details to add or remove from tab.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={submitHandler}>
          <div className="flex flex-col items-start gap-2 mb-6">
            <OrderFormBody item={item} control={form.control} />
          </div>
          <DialogFooter>
            <Button variant="destructive" type="button" disabled={form.formState.isSubmitting} onClick={removeHandler}>Remove Order</Button>
            <Button disabled={form.formState.isSubmitting}>Confirm Order</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>

}

function OrderFormBody({ item, control }: {
  item: Item
  control: Control<OrderCreateRaw>
}) {
  const { fields: substitutionFields } = useFieldArray({ control, name: "substitutions", keyName: "key" })
  const { fields: addonFields } = useFieldArray({ control, name: "addons", keyName: "key" })

  return <>
    {item.variants.length > 0 && <FormLabel>Variants</FormLabel>}
    {item.variants.length > 0 && <FormField
      control={control}
      name="item.variantId"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup
              onValueChange={(e) => field.onChange(parseInt(e))}
              defaultValue={field.value?.toString()}
              value={field.value?.toString()}
              className="flex flex-row flex-wrap"
            >
              {item.variants.map(v => (
                <FormItem key={v.id}>
                  <FormControl>
                    <RadioGroupItem value={v.id.toString()} className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground py-1 px-3 rounded text-sm border-solid border-muted-foreground border">
                      {v.name}
                    </RadioGroupItem>
                  </FormControl>
                  <FormLabel></FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    }
    {substitutionFields.map((field, index, array) => (
      <FormField
        key={field.key}
        control={control}
        name={`substitutions.${index}.itemId`}
        rules={{}}
        render={({ field }) => {
          const substitution_group = item.substitution_groups.find(group => group.id === array[index].id)

          return <FormItem>
            <FormLabel>{substitution_group?.name ?? "NOT FOUND"}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(e) => field.onChange(parseInt(e))}
                defaultValue={field.value.toString()}
                value={field.value.toString()}
                className="flex flex-row flex-wrap"
              >
                {substitution_group?.substitutions.map(v => (
                  <FormItem key={v.id}>
                    <FormControl>
                      <RadioGroupItem value={v.id.toString()} className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground py-1 px-3 rounded text-sm border-solid border-muted-foreground border">
                        {v.name}
                      </RadioGroupItem>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        }}
      />

    ))}
    {addonFields.map((field, index, array) => (
      <FormField
        key={field.key}
        control={control}
        name={`addons.${index}.quantity`}
        rules={{}}
        render={({ field }) => {
          const addon = item.addons.find(addon => addon.id === array[index].id)
          return <FormItem>
            <FormLabel>{addon?.name}</FormLabel>
            <FormControl >
              <CounterInput {...field} max={5} disabled onChange={field.onChange} />
            </FormControl>
          </FormItem>
        }}
      />
    ))}
  </>
}
