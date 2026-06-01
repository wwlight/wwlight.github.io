import { BookOpen, Bookmark, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { ColorThemePicker } from "@/theme/components/ColorThemePicker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cardIconClass } from "@/components/bookmarks/public/ui-helpers";
import { cn } from "@/lib/utils";

function BookmarkSettingsIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block shrink-0", className)}>
      <Bookmark className="size-full" strokeWidth={2} aria-hidden />
      <Settings2
        className="absolute -bottom-px -right-px size-[0.52em] rounded-full bg-card stroke-[2.5] p-px"
        aria-hidden
      />
    </span>
  );
}

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

export function PublicPageActions({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn("flex items-center gap-2", className)}>
        <ColorThemePicker />

        <HeaderIconLink href="/blog/" label="返回博客">
          <BookOpen className="size-[1.2rem]" />
        </HeaderIconLink>

        <HeaderIconLink href="/admin/bookmarks/" label="书签管理">
          <BookmarkSettingsIcon className="size-[1.2rem]" />
        </HeaderIconLink>
      </div>
    </TooltipProvider>
  );
}
