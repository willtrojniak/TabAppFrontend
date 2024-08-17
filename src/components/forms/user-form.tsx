import { useUpdateUser } from "@/api/users";
import { UserUpdate, userUpdateSchema } from "@/types/schemas";
import { User } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Control, useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { CardForm } from "./card-form";

function getUserDefaults(user: User): User {
  return { ...user, preferred_name: user.preferred_name ?? "" }
}

export function useUserForm({ user }: { user: User }) {
  const form = useForm<User>({
    resolver: zodResolver(userUpdateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getUserDefaults(user)
  })

  const updateUser = useUpdateUser();
  const onError = React.useCallback((_: Error) => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "An unknown error has occured"
    })
  }, [])

  React.useEffect(() => {
    form.reset(getUserDefaults(user), { keepValues: false })
  }, [user])

  const onSubmit = React.useCallback(async (values: UserUpdate) => {
    await updateUser.mutateAsync({ userId: user.id, data: values }, {
      onSuccess: () => {
        toast({
          title: `Success!`,
          duration: 5000
        })
      },
      onError,
    })
  }, [user.id])
  const title = "Edit User Preferences"
  const desc = "Make changes to your user preferences."

  return { form, onSubmit, title, desc }
}

export function UserFormCard({ user, className }: { user: User, className?: string }) {
  const { form, onSubmit, title, desc } = useUserForm({ user })

  return <CardForm form={form} className={className} onSubmit={onSubmit} title={title} desc={desc}>
    <UserFormBody control={form.control} />
  </CardForm>
}


function UserFormBody({ control }: {
  control: Control<User>,
}) {
  return <div className="">
    <FormField
      control={control}
      name="name"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 gap-0 items-center">
          <FormLabel className="">Name</FormLabel>
          <FormControl>
            <Input disabled {...field} className="col-span-2" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="preferred_name"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 gap-2 items-center">
          <FormLabel>Preferred Name</FormLabel>
          <FormControl>
            <Input {...field} className="col-span-2" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="email"
      rules={{}}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 gap-2 items-center">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input disabled {...field} className="col-span-2" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
  </div>
}
