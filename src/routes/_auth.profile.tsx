import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/profile')({
  component: ProfileComponent
})

function ProfileComponent() {
  const { user } = Route.useRouteContext();

  return <div>
    Username: {user.name}

  </div>
}
