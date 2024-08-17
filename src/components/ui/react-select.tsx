import { cn } from '@/lib/utils'
import React from 'react'
import Select from 'react-select'

export const ReactSelect = React.forwardRef<React.ElementRef<Select>, React.ComponentPropsWithoutRef<typeof Select>>((props, ref) => {
  return <Select {...props} ref={ref} menuShouldScrollIntoView={false} unstyled classNames={{
    container: () => cn(
      "overflow-visible",
    ),
    control: (state) => {
      return cn(
        "flex overflow-visible flex-wrap w-full justify-between cursor-pointer rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background placeholder:text-muted-foreground [&>span]:line-clamp-1",
        state.isDisabled && "cursor-not-allowed opacity-50",
        state.isFocused && "outline-none ring-2 ring-ring ring-offset-2"
      )
    },
    valueContainer: (state) => cn(
      "flex gap-2 overflow-visible",
      state.isDisabled && "cursor-not-allowed"
    ),
    input: () => cn(
    ),
    placeholder: () => cn(
      "text-muted-foreground"
    ),
    indicatorsContainer: () => cn(
      "flex flex-row"
    ),
    dropdownIndicator: (state) => cn(
      state.isDisabled && "cursor-not-allowed"
    ),
    clearIndicator: () => cn(
      "cursor-pointer"
    ),
    menu: () => cn(
      "relative z-50 max-h-96 min-w-[8rem]  rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 translate-y-1"
    ),
    menuList: () => "p-1 text-sm",
    option: (state) => {
      return cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 outline-none",
        state.isFocused && "bg-accent text-accent-foreground",
        state.isDisabled && "pointer-events-none opacity-50")
    },
    noOptionsMessage: () => "text-sm py-8",
    multiValue: () => cn(
      "bg-accent rounded-sm text-xs overflow-hidden"
    ),
    multiValueLabel: () => cn(
      "p-1"
    ),
    multiValueRemove: () => cn(
      "hover:bg-destructive px-0.5 py-1"
    )
  }}
  />
});
