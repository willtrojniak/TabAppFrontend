import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { format, parse, parseISO, startOfToday } from "date-fns";
import { Calendar } from "./calendar";
import { DateRange } from "react-day-picker";

function toDateRange(dates?: { from?: string, to?: string }) {
  return !dates ? undefined : {
    from: dates.from ? parse(dates.from, "yyyy-MM-dd", new Date()) : undefined,
    to: dates.to ? parse(dates.to, "yyyy-MM-dd", new Date()) : undefined
  } satisfies DateRange
}

function toStringRange(dates?: DateRange) {
  return !dates ? undefined : {
    from: dates.from && !isNaN(dates.from.getTime()) ? format(dates.from, "yyyy-MM-dd") : undefined,
    to: dates.to && !isNaN(dates.to.getTime()) ? format(dates.to, "yyyy-MM-dd") : "",
  }
}

export function DateRangeInput({ value, onChange }: {
  value?: { from: string, to: string },
  onChange: (v?: { from?: string, to?: string }) => void
}) {
  const from = value?.from ? parseISO(value?.from) : null
  const to = value?.to ? parseISO(value?.to) : null

  const formattedFrom = from ? format(from, "LLL dd, y") : ""
  const formattedTo = to ? format(to, "LLL dd, y") : ""
  console.log(value)

  return <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className="gap-2 w-[280px] flex"
      >
        <CalendarIcon className="w-4 h-4" />
        {value?.from ? (
          value.to ? (
            <>
              {formattedFrom} -{" "}
              {formattedTo}
            </>
          ) : (
            <div>
              {formattedFrom} - {" "}
            </div>
          )
        ) : (
          <span>Select start and end dates</span>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        initialFocus
        mode="range"
        disabled={(date) => date < startOfToday()}
        defaultMonth={value?.from ? new Date(value?.from) : new Date()}
        selected={toDateRange(value)}
        onSelect={(dateRange) => onChange(toStringRange(dateRange))}
        numberOfMonths={1}
      />
    </PopoverContent>
  </Popover>
}
