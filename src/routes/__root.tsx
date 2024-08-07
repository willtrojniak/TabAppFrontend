import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient } from "@tanstack/react-query";
import { Auth } from "../types/types";

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
