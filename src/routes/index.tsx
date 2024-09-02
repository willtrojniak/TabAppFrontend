import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Page
})

function Page() {
  return <div className='flex flex-col items-center'>
    <Card>
      <CardHeader>
        <CardTitle className='text-center'>Welcome!</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-2'>
        <div className='flex flex-col gap-2 items-center'>
          To get started:
          <Link to='/shops'><Button variant="secondary">Go to your shops</Button></Link>
        </div>

      </CardContent>
    </Card>
  </div>
}
