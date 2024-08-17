import { useCreateSubstitutionGroup, useUpdateSubstitutionGroup } from "@/api/substitutions"
import { SubstitutionGroupCreate, SubstitutionGroupCreateInput, substitutionGroupCreateSchema } from "@/types/schemas"
import { ItemOverview, SubstitutionGroup } from "@/types/types"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Control, useForm } from "react-hook-form"
import { toast } from "../ui/use-toast"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { DialogForm } from "./dialog-form"
import { SortableMultiSelect } from "../ui/sortable-select"
import { useOnErrorToast } from "@/api/toasts"

function getGroupDefaults(group?: SubstitutionGroup) {
  return {
    name: group?.name ?? "",
    substitution_item_ids: group?.substitutions ?? []
  } satisfies SubstitutionGroupCreateInput
}

export function useSubstitutionGroupForm({ shopId, group }: {
  shopId: number
  group?: SubstitutionGroup
}) {
  const form = useForm<SubstitutionGroupCreateInput>({
    resolver: zodResolver(substitutionGroupCreateSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: getGroupDefaults(group)
  })
  const createGroup = useCreateSubstitutionGroup();
  const updateGroup = useUpdateSubstitutionGroup();
  const onError = useOnErrorToast();

  React.useEffect(() => {
    form.reset(getGroupDefaults(group))
  }, [group])

  const onSubmit = React.useCallback(async (v: unknown) => {
    const values = v as SubstitutionGroupCreate
    if (!group?.id) {
      await createGroup.mutateAsync({ shopId, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    } else {
      await updateGroup.mutateAsync({ shopId, groupId: group.id, data: values }, {
        onSuccess: () => {
          toast({
            title: `Success!`,
            duration: 5000
          })
        },
        onError,
      })
    }
  }, [shopId, group?.id])
  const title = !group ? "Create Substitution Group" : "Edit Substitution Group"
  const desc = !group ? "Create a new substitution group." : "Make changes to an existing substitution group."

  return { form, onSubmit, title, desc }
}
export function SubstitutionGroupFormDialog({ children, shopId, group, items }: { children: React.ReactNode, shopId: number, group?: SubstitutionGroup, items: ItemOverview[] }) {
  const { form, onSubmit, title, desc } = useSubstitutionGroupForm({ shopId, group })

  return <DialogForm form={form} title={title} desc={desc} trigger={children} onSubmit={onSubmit} shouldClose={!group}>
    <SubstitutionGroupFormBody control={form.control} group={group} items={items} />
  </DialogForm>
}

function SubstitutionGroupFormBody({ control, items }: {
  control: Control<SubstitutionGroupCreateInput>,
  group?: SubstitutionGroup,
  items: ItemOverview[]
}) {
  return <>
    <FormField
      control={control}
      name="name"
      rules={{}}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} placeholder="i.e. Milk Alternatives" />
          </FormControl>
          <FormDescription>Substitution group name.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
    <FormField
      control={control}
      name="substitution_item_ids"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Substitutions</FormLabel>
          <FormControl>
            <SortableMultiSelect
              {...field}
              isMulti
              options={items}
              getOptionValue={(o) => { const item = o as ItemOverview; return item.id.toString() }}
              getOptionLabel={(o) => { const item = o as ItemOverview; return item.name }}
            />
          </FormControl>
          <FormDescription>Options for the substitution group.</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
  </>
}
