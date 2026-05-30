import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function BookmarkCardGrid({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] items-stretch gap-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
