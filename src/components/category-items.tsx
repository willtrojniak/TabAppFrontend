import { Category } from "@/types/types";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import React from "react";

export function CategoryTabSelect({ categories, value, onValueChange, disabled = false, allowNone = true }: {
  allowNone?: boolean
  value?: Category,
  disabled?: boolean,
  onValueChange: (category?: Category) => void
  categories: Category[]
}) {

  const handleValueChange = React.useCallback((value: string) => {
    const category = categories.find(c => c.id.toString() === value)
    onValueChange(category)
  }, [categories])

  if (!allowNone && categories.length === 0) return <div>No Categories</div>

  return <Tabs value={value?.id.toString() ?? ""} onValueChange={handleValueChange} className="max-w-full overflow-x-scroll pr-2">
    <TabsList>
      {allowNone && <TabsTrigger key={''} value={''} disabled={disabled}>All</TabsTrigger>}
      {categories.map(c => <TabsTrigger key={c.id} value={`${c.id}`} disabled={disabled}>{c.name}</TabsTrigger>)}
    </TabsList>
  </Tabs >
}
