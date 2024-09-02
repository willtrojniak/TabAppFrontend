import { TabOverview } from "@/types/types"
import { ColumnDef } from "@tanstack/react-table"
import { Format24hTime, GetActiveDayAcronyms, getFormattedDayFromUTC, getMinutes24hTime } from "@/util/dates"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import React from "react"
import { ExternalLink, Eye } from "lucide-react"
import { formatCurrencyUSD } from "@/util/currency"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

export function useTabCheckoutColumns(shopId: number): ColumnDef<TabOverview>[] {
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
      },
      sortingFn: 'fuzzy',
    },
    {
      accessorKey: "organization",
      header: "Organization",
    },
    {
      accessorKey: "verification_method",
      header: "Verification Method",
    },
    {
      accessorKey: "verification_list",
      header: "Verified Users",
      cell: ({ row }) => {
        const tab = row.original
        return tab.verification_list.length === 0 ? "-" : <Dialog>
          <DialogTrigger asChild><Button variant="ghost"><Eye className="w-4 h-4" /></Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verified Users</DialogTitle>
            </DialogHeader>
            <ul>
              {tab.verification_list.map(email => <li key={email}>{email}</li>)}
            </ul>
          </DialogContent>
        </Dialog>
      }

    },
    {
      accessorKey: "dollar_limit_per_order",
      header: () => <div className="text-right">Limit</div>,
      cell: ({ row }) => {
        const tab = row.original
        const formatted = formatCurrencyUSD(tab.dollar_limit_per_order)
        return <div className="text-right font-medium">{formatted}</div>
      },
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
        return <div className="">{getFormattedDayFromUTC(tab.start_date)}</div>
      }
    },
    {
      accessorKey: "end_date",
      header: () => <div className="">End Date</div>,
      cell: ({ row }) => {
        const tab = row.original
        return <div className="">{getFormattedDayFromUTC(tab.end_date)}</div>
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
      id: "active",
      filterFn: (row, _, filterValue: boolean) => {
        const tab = row.original
        const startDate = Date.parse(tab.start_date)
        const endDate = Date.parse(tab.end_date)
        const startMin = getMinutes24hTime(tab.daily_start_time)
        const endMin = getMinutes24hTime(tab.daily_end_time)

        const now = new Date()
        const time = now.getMinutes() + now.getHours() * 60;
        const day = now.setUTCHours(0, 0, 0, 0)



        return !filterValue || (day > startDate && day < endDate && time > startMin && time < endMin)

      }
    }
  ] satisfies ColumnDef<TabOverview>[], [shopId])
}
