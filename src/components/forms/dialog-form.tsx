import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export function DialogForm<T extends FieldValues>({ children, title, desc, trigger, shouldClose = true, form, onSubmit, open, onOpenChange, requireDirty = true }:
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
    if (open || intOpen) reset();
  }, [open, intOpen])

  const submitHandler = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
      if (shouldClose) onOpenChange ? onOpenChange(false) : setIntOpen(false)
    } catch (e) { }
  })

  return <Dialog open={onOpenChange ? open : intOpen} onOpenChange={onOpenChange ? onOpenChange : setIntOpen}>
    <DialogTrigger asChild >
      {trigger}
    </DialogTrigger>
    <DialogContent onInteractOutside={(e) => { if (isDirty) e.preventDefault() }} >
      <Form {...form}>
        <form onSubmit={submitHandler} autoComplete="off" >
          <DialogHeader className="mb-6">
            <DialogTitle> {title} </DialogTitle>
            <DialogDescription> {desc} Click save when done.</DialogDescription>
          </DialogHeader>
          <div className="mb-6">
            {children}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="default" disabled={
              (requireDirty && !isDirty) || (!isValid && isSubmitted) || isSubmitting
            }>Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
}

