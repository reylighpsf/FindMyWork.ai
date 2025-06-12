import React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(( { className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-white p-4 shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { Card, CardContent };