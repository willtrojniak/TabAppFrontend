import { Archive } from "lucide-react";
import { Button } from "./button";
import React from "react";
import { cn } from "@/lib/utils";

export const ArchiveButton = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentPropsWithoutRef<typeof Button>>(({ children, onClick, variant, ...props }, ref) => {
  return <Button {...props} ref={ref} variant={variant ?? "ghost"} className={cn("gap-2", props.className)} onClick={(e) => onClick?.(e)}> <Archive className="h-4 w-4" /> {children}</Button >
})
