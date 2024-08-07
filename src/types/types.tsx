export type User = {
  id: string
  email: string
  name: string
  preferred_name?: string
  created_at: string
}

export type Auth = {
  login: () => void
  logout: () => Promise<void>
  isAuthenticated: boolean
  user?: User
}

