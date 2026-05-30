import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border-border/80 bg-transparent text-foreground",
        success: "border-emerald-500/25 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        tip: "border-blue-500/25 bg-blue-500/15 text-blue-700 dark:text-blue-300",
        hot: "border-orange-500/30 bg-orange-500/15 text-orange-700 dark:text-orange-300",
        warning: "border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-200",
        info: "border-sky-500/25 bg-sky-500/15 text-sky-700 dark:text-sky-300",
        github: "border-zinc-500/30 bg-zinc-500/15 text-zinc-700 dark:text-zinc-200",
        purple: "border-violet-500/25 bg-violet-500/15 text-violet-700 dark:text-violet-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
