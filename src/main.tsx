import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './providers/auth'
import axios from 'axios'
import { ThemeProvider } from './providers/theme'

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = false;
axios.interceptors.response.use((response) => {
  const xcsrftoken = response.headers["x-csrf-token"]
  axios.defaults.headers.post['x-csrf-token'] = xcsrftoken
  axios.defaults.headers.put['x-csrf-token'] = xcsrftoken
  axios.defaults.headers.patch['x-csrf-token'] = xcsrftoken
  axios.defaults.headers.delete['x-csrf-token'] = xcsrftoken
  return response
}, (error) => {
  return Promise.reject(error);
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30 // 30 second stale time
    }
  }
})

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
    title: "Tab App"
  },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{
    auth: auth,
    title: "Tab App"
  }} />

}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
