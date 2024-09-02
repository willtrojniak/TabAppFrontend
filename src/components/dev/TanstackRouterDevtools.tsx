import React from "react";

export const TanstackRouterDevtools = process.env.NODE_ENV === 'development' ?
  React.lazy(() => import('@tanstack/router-devtools').then((res) => ({
    default: res.TanStackRouterDevtools
  })))
  : () => null
