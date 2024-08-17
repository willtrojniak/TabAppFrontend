import React from "react";
import { Input } from "./input";
import { ControllerRenderProps } from "react-hook-form";

type PriceInputProps = Pick<ControllerRenderProps, 'onChange'> &
  Omit<React.ComponentPropsWithoutRef<typeof Input>, 'onChange'>


export const PriceInput = React.forwardRef<React.ElementRef<typeof Input>, PriceInputProps>((props, ref) => {
  const { onChange, ...inputProps } = props


  return <Input {...inputProps} ref={ref} onChange={(event) => {
    if (/^[0-9]*\.?[0-9]{0,2}$/.test(event.target.value)) {
      onChange?.(event)
    }
  }} />
}) 
