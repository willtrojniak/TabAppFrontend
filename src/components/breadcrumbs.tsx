import { Link, useRouterState } from "@tanstack/react-router";
import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Home } from "lucide-react";

export function Breadcrumbs() {
  const routerState = useRouterState();
  const breadcrumbs = React.useMemo(() => {
    return routerState.matches.map((match) => {
      const { pathname, context } = match
      return {
        path: pathname,
        title: context?.title ?? ""
      }
    }).filter(({ path, title }) => !path.endsWith("/") && title !== "")
  }, [routerState.matches])

  return <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        {breadcrumbs.length === 0 ?
          <BreadcrumbPage><Home className="w-4 h-4" /></BreadcrumbPage>
          :
          <BreadcrumbLink asChild>
            <Link to='/'><Home className='w-4 h-4' /></Link>
          </BreadcrumbLink>
        }
      </BreadcrumbItem>
      {breadcrumbs.map(({ path, title }, index) => {
        return <React.Fragment key={path}>
          <BreadcrumbSeparator />
          <BreadcrumbItem >
            {index === breadcrumbs.length - 1 ?
              <BreadcrumbPage>{title}</BreadcrumbPage>
              :
              <BreadcrumbLink asChild>
                <Link to={path}>{title}</Link>
              </BreadcrumbLink>}
          </BreadcrumbItem>
        </React.Fragment>
      })}
    </BreadcrumbList>
  </Breadcrumb >
}
