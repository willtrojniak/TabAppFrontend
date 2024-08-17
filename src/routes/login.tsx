import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, redirect } from '@tanstack/react-router'
import GoogleButton from 'react-google-button'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional()
  }),
  component: LoginComponent,
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search.redirect ?? "/",
        replace: true
      })
    }
    return { title: "Sign In" }
  }
})

function LoginComponent() {
  const search = Route.useSearch()

  return <div className='flex flex-col justify-center items-center w-full py-16'>
    <Card className='flex flex-col items-center'>
      <CardHeader className=''>
        <CardTitle className='text-center'>Tab App Sign In</CardTitle>
        <CardDescription className='w-fit text-center'>Sign in to track the status of your tabs.</CardDescription>
      </CardHeader>
      <CardContent >
        <a href={encodeURI(`http://127.0.0.1:3000/auth/google?redirect=${search.redirect}`)}><GoogleButton type='light' /></a>
      </CardContent>
    </Card>
  </div>
}
