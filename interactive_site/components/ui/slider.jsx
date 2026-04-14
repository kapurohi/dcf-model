"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Slider = React.forwardRef(function Slider(
  { className, showTooltip = false, tooltipContent, value, defaultValue, onValueChange, ...props },
  ref,
) {
  const [showTooltipState, setShowTooltipState] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? value ?? [0]);

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback(
    (nextValue) => {
      setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [onValueChange],
  );

  const handlePointerDown = React.useCallback(() => {
    if (showTooltip) {
      setShowTooltipState(true);
    }
  }, [showTooltip]);

  const handlePointerUp = React.useCallback(() => {
    if (showTooltip) {
      setShowTooltipState(false);
    }
  }, [showTooltip]);

  React.useEffect(() => {
    if (!showTooltip) return undefined;
    document.addEventListener("pointerup", handlePointerUp);
    return () => document.removeEventListener("pointerup", handlePointerUp);
  }, [showTooltip, handlePointerUp]);

  function renderThumb(singleValue, index) {
    const thumb = <SliderPrimitive.Thumb className="ui-slider-thumb" onPointerDown={handlePointerDown} />;

    if (!showTooltip) return <React.Fragment key={index}>{thumb}</React.Fragment>;

    return (
      <TooltipProvider key={index} delayDuration={0}>
        <Tooltip open={showTooltipState}>
          <TooltipTrigger asChild>{thumb}</TooltipTrigger>
          <TooltipContent className="ui-slider-tooltip" side="top">
            <p>{tooltipContent ? tooltipContent(singleValue) : singleValue}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("ui-slider-root", className)}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="ui-slider-track">
        <SliderPrimitive.Range className="ui-slider-range" />
      </SliderPrimitive.Track>
      {(internalValue ?? []).map((singleValue, index) => renderThumb(singleValue, index))}
    </SliderPrimitive.Root>
  );
});

export { Slider };
