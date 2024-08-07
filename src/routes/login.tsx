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
        to: search.redirect ?? "/"
      })
    }
  }
})

function LoginComponent() {
  const search = Route.useSearch()

  return <>
    <h1>Login</h1>
    <a href={encodeURI(`http://127.0.0.1:3000/auth/google?redirect=${search.redirect}`)}><GoogleButton type='light' /></a>
  </>
}
