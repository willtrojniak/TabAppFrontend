import { createFileRoute, Link } from '@tanstack/react-router'
import axios from 'axios'
import { useAuth } from '../providers/auth';

export const Route = createFileRoute('/')({
  component: Page
})

function Page() {
  const auth = useAuth();
  return <>
    <h1>Hello {auth?.user?.name}</h1>
    <button onClick={() => {
      axios.post('http://127.0.0.1:3000/api/v1/shops', {
        test: "hello"
      })
    }}>Create Shop</button>
    <Link to='/login'>Login Page</Link>
    <button onClick={auth?.logout}>Logout</button>
  </>
}
