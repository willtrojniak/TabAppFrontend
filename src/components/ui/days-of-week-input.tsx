import React from "react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { GetActiveDayAcronyms, getActiveDayBits } from "@/util/dates";


export function DaysOfWeekInput({ value, onValueChange }: {
  value: number,
  onValueChange: (arg0: number) => void
}) {

  const handleValueChange = React.useCallback((value: string[]) => {
    onValueChange?.(getActiveDayBits(value))
  }, [onValueChange])

  return <ToggleGroup type="multiple" value={value === 0 ? [] : GetActiveDayAcronyms(value)} onValueChange={handleValueChange} className="justify-start">
    <ToggleGroupItem value="Sun">Sun</ToggleGroupItem>
    <ToggleGroupItem value="Mon">Mon</ToggleGroupItem>
    <ToggleGroupItem value="Tue">Tue</ToggleGroupItem>
    <ToggleGroupItem value="Wed">Wed</ToggleGroupItem>
    <ToggleGroupItem value="Thu">Thu</ToggleGroupItem>
    <ToggleGroupItem value="Fri">Fri</ToggleGroupItem>
    <ToggleGroupItem value="Sat">Sat</ToggleGroupItem>
  </ToggleGroup>
}
