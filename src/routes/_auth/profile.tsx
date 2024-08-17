import { UserFormCard } from '@/components/forms/user-form';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/providers/auth';
import { createFileRoute } from '@tanstack/react-router'
import { LogOut } from 'lucide-react';

export const Route = createFileRoute('/_auth/profile')({
  beforeLoad: () => {
    return { title: "Profile" }
  },
  component: ProfileComponent
})

function ProfileComponent() {
  const { user } = Route.useRouteContext();
  const auth = useAuth();

  return <div className='flex flex-col items-start gap-4 max-w-full'>
    <div className='flex flex-col lg:flex-row flex-wrap justify-start items-start gap-4 max-w-full'>
      <div className='flex flex-row flex-wrap items-start gap-2 lg:flex-col'>
        <Card>
          <CardHeader>
            <CardDescription>Signed in as </CardDescription>
            <CardTitle>{user.preferred_name ?? user.name}</CardTitle>
          </CardHeader>
        </Card>
        <Button variant={"outline"} onClick={auth.logout} className='gap-2'><LogOut className='w-4 h-4' /> Sign Out</Button>
      </div>
      <UserFormCard user={user} className="max-w-2xl" />
    </div>
  </div>
}
