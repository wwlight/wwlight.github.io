import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { BookmarkSettingsIcon } from "@/bookmarks/shared/components/BookmarkSettingsIcon";
import { ColorThemePicker } from "@/theme/components/customizer/ColorThemePicker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cardIconClass } from "@/bookmarks/nav/components/chrome/ui-helpers";
import { cn } from "@/lib/utils";

function HeaderIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="rounded-lg border border-border bg-card p-0.5 shadow-sm">
          <a
            href={href}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center theme-r-md transition-colors duration-300",
              cardIconClass,
            )}
            aria-label={label}
          >
            {children}
          </a>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        <p className="font-medium">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function NavPageActions({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("flex items-center gap-2", className)}>
        <ColorThemePicker />

        <HeaderIconLink href="/blog/" label="返回博客">
          <BookOpen className="size-[1.2rem]" />
        </HeaderIconLink>

        <HeaderIconLink href="/bookmarks/admin/" label="书签管理">
          <BookmarkSettingsIcon className="size-[1.2rem]" />
        </HeaderIconLink>
      </div>
    </TooltipProvider>
  );
}
