import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cardIconClass } from "@/bookmarks/admin/lib/admin-helpers";
import { cn } from "@/lib/utils";

type AdminActionButtonProps = {
  label: string;
  description?: string;
  children: ReactNode;
} & Pick<
  ComponentProps<typeof Button>,
  "onClick" | "disabled" | "className" | "draggable" | "onDragStart" | "onDragEnd" | "type"
>;

export function AdminActionButton({
  label,
  description,
  children,
  className,
  disabled,
  ...buttonProps
}: AdminActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("inline-flex outline-none", disabled && "cursor-not-allowed")}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("focus-visible:ring-0 focus-visible:ring-offset-0", cardIconClass, className)}
            disabled={disabled}
            aria-label={label}
            {...buttonProps}
          >
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        <p className="font-medium">{label}</p>
        {description ? (
          <p className="mt-0.5 max-w-56 text-muted-foreground">{description}</p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}
