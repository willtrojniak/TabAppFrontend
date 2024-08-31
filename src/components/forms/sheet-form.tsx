import React from 'react'
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

export function SheetForm<T extends FieldValues>({ children, title, desc, trigger, shouldClose = true, form, onSubmit, }:
  {
    form: UseFormReturn<T>,
    onSubmit: (data: T) => Promise<void>,
    children: React.ReactNode,
    title: string,
    desc: string,
    trigger: React.ReactNode,
    shouldClose?: boolean
    open?: boolean
    onOpenChange?: (isOpen: boolean) => void
    requireDirty?: boolean
  }) {

  const { reset, handleSubmit, formState: { isDirty, isValid, isSubmitting, isSubmitted } } = form;
  const [intOpen, setIntOpen] = React.useState(false);

  React.useEffect(() => {
    if (intOpen) reset();
  }, [intOpen])

  const submitHandler = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
      if (shouldClose) setIntOpen(false)
    } catch (e) { }
  })

  return <Sheet open={intOpen} onOpenChange={setIntOpen}>
    <SheetTrigger asChild >
      {trigger}
    </SheetTrigger>
    <SheetContent onInteractOutside={(e) => { if (isDirty) e.preventDefault() }} side={"bottom"} className='h-svh overflow-y-auto min-w-fit px-16'>
      <Form {...form}>
        <form onSubmit={submitHandler} autoComplete="off" >
          <SheetHeader className="mb-6">
            <SheetTitle> {title} </SheetTitle>
            <SheetDescription> {desc} Click save when done.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 mb-6">
            {children}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" variant="default" disabled={
              !isDirty || (!isValid && isSubmitted) || isSubmitting
            }>Save</Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  </Sheet>
}

