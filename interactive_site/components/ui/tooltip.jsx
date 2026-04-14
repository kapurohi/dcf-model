"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef(function TooltipContent(
  { className, sideOffset = 8, showArrow = false, ...props },
  ref,
) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn("ui-tooltip-content", className)}
        {...props}
      >
        {props.children}
        {showArrow ? <TooltipPrimitive.Arrow className="ui-tooltip-arrow" /> : null}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});
