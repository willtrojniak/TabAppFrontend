import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/shops')({
  beforeLoad: () => ({ title: "Shops" }),
})
