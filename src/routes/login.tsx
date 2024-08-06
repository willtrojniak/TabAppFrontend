import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginComponent
})

function LoginComponent() {
  return <a href='http://127.0.0.1:3000/auth/google'>Login</a>
}
