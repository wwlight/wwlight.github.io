import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cardIconClass } from "@/lib/bookmarks/admin-helpers";
import { cn } from "@/lib/utils";

interface AdminThemeToggleProps {
  className?: string;
}

export function AdminThemeToggle({ className }: AdminThemeToggleProps) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={cn(
        "relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus-visible:ring-0 focus-visible:ring-offset-0",
        cardIconClass,
        className,
      )}
      aria-label="切换主题"
      onClick={toggleTheme}
    >
      <Sun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </button>
  );
}

export function AdminThemeControl({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-0.5 shadow-sm", className)}>
      <AdminThemeToggle />
    </div>
  );
}
