import { useCreateShopInvite } from "@/api/shops";
import { useOnErrorToast, useOnSuccessToast } from "@/api/toasts";
import { ShopUserCreate, ShopUserCreateInput, shopUserSchema } from "@/types/schemas";
import { ShopUser } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Control, useForm } from "react-hook-form";
import { DialogForm } from "./dialog-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ShopRolesInput } from "../ui/shop-roles-input";

function getDefaults(user?: ShopUser) {
  return {
    email: user?.email ?? "",
    roles: user?.roles ?? 0,

  } satisfies ShopUserCreateInput

}

export function useShopUserForm({ shopId, user }: { shopId: number, user?: ShopUser }) {
  const form = useForm<ShopUserCreateInput>({
    resolver: zodResolver(shopUserSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getDefaults(user)
  })

  const saveUser = useCreateShopInvite()
  const onSuccess = useOnSuccessToast()
  const onError = useOnErrorToast()

  React.useEffect(() => {
    form.reset(getDefaults(user), { keepValues: false })
  }, [user])

  const onSubmit = React.useCallback(async (v: unknown) => {
    const values = v as ShopUserCreate;
    await saveUser.mutateAsync({ shopId, data: { email: values.email, roles: values.roles } }, {
      onSuccess: () => onSuccess("Successfully saved user."),
      onError,
    })
  }, [shopId, user?.email])

  const title = !user?.email ? "Invite User" : "Modify User Permissions"
  const desc = !user?.email ? "Invite a new user to the shop." : "Change the user's permission"

  return { form, onSubmit, title, desc }
}

export function ShopUserFormDialog({ children, shopId, user }: {
  children: React.ReactNode,
  shopId: number,
  user?: ShopUser
}) {
  const { form, onSubmit, title, desc } = useShopUserForm({ shopId, user })

  return <DialogForm form={form} onSubmit={onSubmit} title={title} desc={desc} trigger={children} shouldClose>
    <ShopUserFormBody control={form.control} user={user} />
  </DialogForm>


}

function ShopUserFormBody({ control, user }: {
  control: Control<ShopUserCreateInput>,
  user?: ShopUser

}) {
  return <div className="flex flex-col gap-2">
    {!user &&
      <FormField
        control={control}
        name="email"
        rules={{}}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="john.doe@example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    }
    <FormField
      control={control}
      name="roles"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Roles</FormLabel>
          <FormControl>
            <ShopRolesInput value={field.value} onValueChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

}
