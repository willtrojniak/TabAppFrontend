import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Page
})

function Page() {
  return <div className='flex flex-col gap-4'>
    <div className='flex justify-around flex-wrap gap-12'>
      <div className='flex flex-col justify-center items-start'>
        <h2 className='text-3xl font-bold mb-8'>Community one cup at a time</h2>
        <p className='max-w-lg mb-4'>
          Bring your community closer together over at your favorite café and
          let us handle the logistics of tracking everyone's order!
        </p>
        <Link to='/shops'><Button variant='default' className='gap-2'>Get Started <ExternalLink className='w-4 h-4' /></Button></Link>
      </div>
      <div className='max-w-lg'>
        <img src='https://cafetrackr-assets.s3.us-east-1.amazonaws.com/tabs.png' className='object-cover shadow-black' />
      </div>
    </div>
  </div>
}
