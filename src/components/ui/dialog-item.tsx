import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { DropdownMenuItem } from "./dropdown-menu";

type Props = {
  triggerChildren: React.ReactNode
  onOpenChange?: (open: boolean) => void
} & React.ComponentPropsWithoutRef<typeof DropdownMenuItem>

export const DialogItem = React.forwardRef<React.ElementRef<typeof DropdownMenuItem>, Props>((props, forwardedRef) => {

  const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } = props;
  return (
    <Dialog onOpenChange={(open) => {
      onOpenChange?.(open)
    }}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          {...itemProps}
          ref={forwardedRef}
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.(event);
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
});
