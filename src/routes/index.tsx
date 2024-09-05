import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Page
})

function Page() {
  return <div className='flex flex-col items-center'>
    <Card>
      <CardHeader>
        <CardTitle>Welcome!</CardTitle>
      </CardHeader>
      <CardContent>
        Sign in to get started managing shops and tabs.
      </CardContent>
      <CardFooter><Link to='/shops' ><Button className='gap-2'>Get Started<ExternalLink className='w-4 h-4' /></Button></Link></CardFooter>
    </Card>
  </div>
}
