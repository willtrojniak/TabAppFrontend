import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Auth } from "../utils/auth";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  auth: Auth
  queryClient: QueryClient
}>()({
  component: RootComponent,
});

function RootComponent() {
  return <>
    <Outlet />
    <TanStackRouterDevtools position="bottom-right" />
  </>
}
