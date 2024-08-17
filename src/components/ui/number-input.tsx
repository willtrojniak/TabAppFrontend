import React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type NumberInputProps = Omit<React.ComponentPropsWithoutRef<typeof Input>, 'onChange' | 'value' | 'min' | 'max'> & {
  value?: number,
  onChange?: (value: number) => void
  min?: number
  max?: number
}

export const NumberInput = React.forwardRef<React.ElementRef<typeof Input>, NumberInputProps>((props, ref) => {
  const { onChange, onBlur, value, max, min = 0, ...inputProps } = props

  return <Input {...inputProps}
    ref={ref}
    value={!value && value !== 0 || isNaN(value) ? "" : value}
    onChange={(event) => {
      if (/^[0-9]*$/.test(event.target.value)) {
        onChange?.(parseInt(event.target.value))
      }
    }}
    onBlur={(e) => {
      if (e.target.value === "") onChange?.(min)
      else if (parseInt(e.target.value) < min) onChange?.(min)
      else if (max && parseInt(e.target.value) > max) onChange?.(max)
      onBlur?.(e)
    }}
    className={cn(props.className, "text-center")}
  />
})

export const CounterInput = React.forwardRef<React.ElementRef<typeof NumberInput>, React.ComponentPropsWithoutRef<typeof NumberInput>>((props, ref) => {
  const { onChange, value, max, min = 0 } = props
  return <div className="flex gap-1 items-start">
    <Button
      type="button"
      disabled={!value || value <= min}
      onClick={() => {
        const val = value ?? (min + 1)
        onChange?.(val - 1)
      }}
      className="w-12 h-10" variant="outline"
    >
      <Minus className="w-4 h-4" />
    </Button>
    <NumberInput ref={ref} {...props} className="w-16" />
    <Button
      type="button"
      disabled={!!value && !!max && value >= max}
      onClick={() => {
        const val = value ?? ((max ?? min) - 1)
        onChange?.(val + 1)
      }}
      className="w-12 h-10" variant="outline"
    >
      <Plus className="w-4 h-4" />
    </Button>
  </div>

})
