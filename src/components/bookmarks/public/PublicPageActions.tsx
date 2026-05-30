import { BookOpen, Bookmark } from "lucide-react";
import type { ReactNode } from "react";
import { PublicThemeControl } from "@/components/bookmarks/public/PublicThemeToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cardIconClass } from "@/components/bookmarks/public/ui-helpers";
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
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
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
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <PublicThemeControl />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>
            <p className="font-medium">切换主题</p>
          </TooltipContent>
        </Tooltip>

        <HeaderIconLink href="/memorandum/dev-qa/" label="返回博客">
          <BookOpen className="size-[1.2rem]" />
        </HeaderIconLink>

        <HeaderIconLink href="/admin/bookmarks/" label="书签管理">
          <Bookmark className="size-[1.2rem]" />
        </HeaderIconLink>
      </div>
    </TooltipProvider>
  );
}
