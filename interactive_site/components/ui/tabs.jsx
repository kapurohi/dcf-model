"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

export function Tabs({ className, ...props }) {
  return <TabsPrimitive.Root className={cn("ui-tabs-root", className)} {...props} />;
}

export function TabsList({ className, children, ...props }) {
  return (
    <TabsPrimitive.List className={cn("ui-tabs-list", className)} {...props}>
      {children}
      <TabsPrimitive.Indicator className="ui-tabs-indicator" />
    </TabsPrimitive.List>
  );
}

export function TabsTab({ className, ...props }) {
  return <TabsPrimitive.Tab className={cn("ui-tabs-tab", className)} {...props} />;
}

export function TabsPanel({ className, ...props }) {
  return <TabsPrimitive.Panel className={cn("ui-tabs-panel", className)} {...props} />;
}

export { TabsTab as TabsTrigger, TabsPanel as TabsContent };
