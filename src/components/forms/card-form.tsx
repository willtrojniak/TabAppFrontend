import React from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Form } from '../ui/form';

export function CardForm<T extends FieldValues>({ children, className, title, desc, form, onSubmit, requireDirty = true }:
  {
    form: UseFormReturn<T>,
    onSubmit: (data: T) => Promise<void>
    requireDirty?: boolean,
    className?: string,
    children: React.ReactNode,
    title: string,
    desc: string,
  }) {
  const { handleSubmit, formState: { isDirty, isValid, isSubmitted, isSubmitting } } = form;

  return <Card className={className} >
    <CardHeader >
      <CardTitle> {title} </CardTitle>
      <CardDescription> {desc} Click save when done.</CardDescription>
    </CardHeader>
    <Form {...form}>
      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          {children}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="submit" variant="default" disabled={
            (requireDirty && !isDirty) || (!isValid && isSubmitted) || isSubmitting
          }>Save</Button>
        </CardFooter>
      </form>
    </Form>
  </Card>
}

