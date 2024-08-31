import { useCreateShop, useUpdateShop } from "@/api/shops";
import { ShopCreate, ShopCreateInput, shopCreateSchema } from "@/types/schemas";
import { PaymentMethod, Shop } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import React from "react";
import { AxiosError } from "axios";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { CardForm } from "./card-form";
import { ReactSelect } from "../ui/react-select";

function getShopDefaults(shop?: Shop) {
  return {
    name: shop?.name ?? "",
    payment_methods: shop?.payment_methods.map(v => ({ value: v, label: v })) ?? []
  } satisfies ShopCreateInput
}

export function useShopForm({ shop }: { shop?: Shop }) {
  const form = useForm<ShopCreateInput>({
    resolver: zodResolver(shopCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getShopDefaults(shop)
  })

  const createShop = useCreateShop();
  const updateShop = useUpdateShop();
  const onError = React.useCallback((error: Error) => {
    if (!(error instanceof AxiosError) || !error.response || error.response.status !== 409) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An unknown error has occured"
      })
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "A shop with conflicting data already exists."
      })
    }
  }, [])

  React.useEffect(() => {
    form.reset(getShopDefaults(shop), { keepValues: false })
  }, [shop])

  const onSubmit = React.useCallback(async (v: unknown) => {
    const values = v as ShopCreate
    if (!shop?.id) {
      await createShop.mutateAsync({ data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    } else {
      await updateShop.mutateAsync({ shopId: shop.id, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    }
  }, [shop?.id])

  const title = !shop ? "Create Shop" : "Edit Shop"
  const desc = !shop ? "Create a new shop." : "Make changes to an existing shop."

  return { form, onSubmit, title, desc }
}

export function ShopFormCard({ shop, paymentMethods }: { shop?: Shop, paymentMethods: PaymentMethod[] }) {
  const { form, onSubmit, title, desc } = useShopForm({ shop });

  return <CardForm form={form} title={title} desc={desc} onSubmit={onSubmit}>
    <ShopFormBody control={form.control} shop={shop} paymentMethods={paymentMethods} />
  </CardForm>

}

function ShopFormBody({ control, paymentMethods }: {
  control: Control<ShopCreateInput>,
  shop?: Shop,
  paymentMethods: PaymentMethod[],
}) {

  const options = React.useMemo(() => paymentMethods.map(m => ({ value: m, label: m })), [paymentMethods])

  return <>
    <FormField
      control={control}
      name="name"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Matcha Shop" />
          </FormControl>
          <FormDescription>Shop name.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="payment_methods"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payment Methods</FormLabel>
          <FormControl>
            <ReactSelect
              {...field}
              isMulti
              options={options}
            />
          </FormControl>
          <FormDescription>The payment methods accepted by this shop.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
  </>
}
