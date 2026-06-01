import { Bookmark, FolderKanban, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BookmarkStatsCardsProps {
  sections: number;
  cards: number;
  bookmarks: number;
}

interface StatItem {
  key: keyof BookmarkStatsCardsProps;
  label: string;
  unit: string;
  hint: string;
  icon: LucideIcon;
  emphasis: "soft" | "base" | "strong";
}

const statItems: StatItem[] = [
  { key: "sections", label: "模块", unit: "个", hint: "顶层分类", icon: Layers, emphasis: "soft" },
  { key: "cards", label: "分组", unit: "个", hint: "模块内分组", icon: FolderKanban, emphasis: "base" },
  { key: "bookmarks", label: "书签", unit: "条", hint: "全部链接", icon: Bookmark, emphasis: "strong" },
];

const emphasisStyles = {
  soft: {
    border: "border-primary/30",
    bg: "from-primary/12 via-primary/5 to-primary/8",
    panel: "from-primary/24 via-primary/12 to-primary/5",
    watermark: "text-primary/20",
    hint: "text-primary/45",
  },
  base: {
    border: "border-primary/35",
    bg: "from-primary/14 via-primary/6 to-primary/10",
    panel: "from-primary/28 via-primary/14 to-primary/6",
    watermark: "text-primary/22",
    hint: "text-primary/50",
  },
  strong: {
    border: "border-primary/40",
    bg: "from-primary/16 via-primary/7 to-primary/11",
    panel: "from-primary/32 via-primary/16 to-primary/7",
    watermark: "text-primary/24",
    hint: "text-primary/55",
  },
} as const;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function AnimatedStatNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const [pulse, setPulse] = useState(false);
  const fromRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setDisplay(value);
      fromRef.current = value;
      mountedRef.current = true;
      return;
    }

    if (!mountedRef.current) {
      setDisplay(value);
      fromRef.current = value;
      mountedRef.current = true;
      return;
    }

    const from = fromRef.current;
    const duration = 650;
    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(from + (value - from) * easeOutCubic(progress)));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      fromRef.current = value;
      setPulse(true);
      window.setTimeout(() => setPulse(false), 320);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span
      className={cn(
        "inline-block origin-left tabular-nums transition-transform duration-300 ease-out",
        pulse && "scale-[1.04]",
      )}
    >
      {display}
    </span>
  );
}

export function BookmarkStatsCards({ sections, cards, bookmarks }: BookmarkStatsCardsProps) {
  const values = { sections, cards, bookmarks };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {statItems.map(({ key, label, unit, hint, icon: Icon, emphasis }) => {
        const style = emphasisStyles[emphasis];

        return (
          <Card
            key={key}
            className={cn("relative h-full overflow-hidden border p-0 shadow-sm", style.border)}
          >
            <div
              className={cn("absolute inset-0 bg-gradient-to-br", style.bg)}
              aria-hidden
            />

            <Icon
              className={cn(
                "pointer-events-none absolute -right-5 -bottom-8 size-36 rotate-12",
                style.watermark,
              )}
              strokeWidth={1}
              aria-hidden
            />

            <div className="relative flex min-h-28">
              <div
                className={cn(
                  "relative flex w-24 shrink-0 items-center justify-center overflow-hidden border-r bg-gradient-to-br",
                  style.border,
                  style.panel,
                )}
                aria-hidden
              >
                <Icon
                  className={cn("absolute -left-2 size-24 -rotate-12", style.watermark)}
                  strokeWidth={1.25}
                />
                <Icon className="relative size-8 text-primary drop-shadow-sm" strokeWidth={1.75} />
              </div>

              <div className="relative flex min-w-0 flex-1 flex-col justify-between p-4 pl-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium tracking-wide text-primary">{label}</p>
                  <p className={cn("shrink-0 text-xs font-medium tracking-wide", style.hint)}>
                    {hint}
                  </p>
                </div>

                <p className="text-[2rem] font-semibold leading-none tracking-tight">
                  <AnimatedStatNumber value={values[key]} />
                  <span className={cn("ml-1.5 text-base font-normal", style.hint)}>{unit}</span>
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
