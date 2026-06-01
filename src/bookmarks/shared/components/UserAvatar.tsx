import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md";
}

export function UserAvatar({ name, className, size = "md" }: UserAvatarProps) {
  const initial = (name.trim().charAt(0) || "A").toUpperCase();
  const sizeClass = size === "sm" ? "size-7 text-xs" : "size-8 text-[13px]";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold leading-none tracking-tight",
        "bg-gradient-to-br from-primary via-primary/92 to-primary/78 text-primary-foreground",
        "shadow-[0_1px_2px_color-mix(in_oklab,var(--primary)_28%,transparent),inset_0_1px_0_rgba(255,255,255,0.18)]",
        "ring-1 ring-primary/25",
        sizeClass,
        className,
      )}
      aria-hidden
    >
      <span className="relative">{initial}</span>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/14 to-white/0"
        aria-hidden
      />
    </div>
  );
}
