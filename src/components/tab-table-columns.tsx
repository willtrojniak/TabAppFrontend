import { TabOverview, TabStatus } from "@/types/types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "./ui/badge"
import { Format24hTime, GetActiveDayAcronyms, FormatDateMMDDYYYY } from "@/util/dates"
import { Button } from "./ui/button"
import { Link } from "@tanstack/react-router"
import React from "react"
import { BadgeAlert, BadgeCheck, BadgeDollarSign, ExternalLink } from "lucide-react"

export function useTabColumns(shopId: number): ColumnDef<TabOverview>[] {
  return React.useMemo(() => [
    {
      accessorKey: "id",
    },
    {
      accessorKey: "display_name",
      header: "Tab",
      cell: ({ row }) => {
        const tab = row.original
        return <Button asChild variant="link"><Link to="/shops/$shopId/tabs/$tabId" params={{ shopId, tabId: tab.id }}>{tab.display_name}<ExternalLink className="ml-2 w-4 h-4" /></Link></Button>
      }
    },
    {
      id: "updates",
      cell: ({ row }) => {
        const tab = row.original
        return <div className="font-bold text-center">
          {tab.pending_updates ? <BadgeAlert /> : ""}
        </div>
      }
    },
    {
      accessorKey: "status",
      header: () => <div className="">Status</div>,
      cell: ({ row }) => {
        const tab = row.original
        return <div className="">
          <Badge
            variant={tab.status === TabStatus.pending ? "default" : "outline"}>{tab.status}</Badge>
        </div>
      }
    },
    {
      accessorKey: "is_pending_balance",
      header: () => <div className="">Balance</div>,
      cell: ({ row }) => {
        const tab = row.original
        return <div className="text-center">
          {tab.is_pending_balance ? <BadgeDollarSign className="fill-destructive " /> : <BadgeCheck />}
        </div>
      }
    },
    {
      accessorKey: "organization",
      header: "Organization",
    },
    {
      accessorKey: "active_days_of_wk",
      header: "Active Days of the Week",
      cell: ({ row }) => {
        const tab = row.original
        return <div className="whitespace-nowrap">{GetActiveDayAcronyms(tab.active_days_of_wk).join(", ")}</div>
      }
    },
    {
      accessorKey: "start_date",
      header: () => <div className="">Start Date</div>,
      cell: ({ row }) => {
        const tab = row.original
        return <div className="">{FormatDateMMDDYYYY(tab.start_date)}</div>
      }
    },
    {
      accessorKey: "end_date",
      header: () => <div className="">End Date</div>,
      cell: ({ row }) => {
        const tab = row.original
        return <div className="">{FormatDateMMDDYYYY(tab.end_date)}</div>
      }
    },
    {
      accessorKey: "daily_start_time",
      header: () => <div className="">Daily Start Time</div>,
      cell: ({ row }) => {
        const tab = row.original
        return <div className="">{Format24hTime(tab.daily_start_time)}</div>
      }

    },
    {
      accessorKey: "daily_end_time",
      header: () => <div className="">Daily End Time</div>,
      cell: ({ row }) => {
        const tab = row.original
        return <div className="">{Format24hTime(tab.daily_end_time)}</div>
      }
    },
    {
      accessorKey: "billing_interval_days",
      header: () => <div >Billing Interval</div>,
      cell: ({ row }) => {
        const tab = row.original
        return <div className="">{tab.billing_interval_days} days</div>
      }
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method"
    },
    {
      accessorKey: "payment_details",
      header: "Payment Details",
      cell: ({ row }) => {
        const tab = row.original
        return tab.payment_details ?? "None"
      }
    },
  ], [shopId])
}
