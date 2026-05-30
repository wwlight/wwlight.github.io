import { Bookmark, FolderKanban, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminStatsProps {
  sections: number;
  cards: number;
  bookmarks: number;
}

interface StatItem {
  key: keyof AdminStatsProps;
  label: string;
  unit: string;
  hint: string;
  icon: LucideIcon;
  borderClass: string;
  bgClass: string;
  panelClass: string;
  watermarkClass: string;
  accentClass: string;
  hintClass: string;
}

const statItems: StatItem[] = [
  {
    key: "sections",
    label: "模块",
    unit: "个",
    hint: "顶层分类",
    icon: Layers,
    borderClass: "border-sky-500/35 dark:border-sky-400/40",
    bgClass:
      "bg-gradient-to-br from-sky-500/14 via-sky-500/6 to-sky-500/10 dark:from-sky-500/20 dark:via-sky-500/10 dark:to-sky-500/14",
    panelClass:
      "bg-gradient-to-br from-sky-500/28 via-sky-500/14 to-sky-500/6 dark:from-sky-500/35 dark:via-sky-500/18 dark:to-sky-500/8",
    watermarkClass: "text-sky-600/22 dark:text-sky-400/28",
    accentClass: "text-sky-600 dark:text-sky-400",
    hintClass: "text-sky-800/50 dark:text-sky-200/55",
  },
  {
    key: "cards",
    label: "分组",
    unit: "个",
    hint: "模块内分组",
    icon: FolderKanban,
    borderClass: "border-amber-500/35 dark:border-amber-400/40",
    bgClass:
      "bg-gradient-to-br from-amber-500/14 via-amber-500/6 to-amber-500/10 dark:from-amber-500/20 dark:via-amber-500/10 dark:to-amber-500/14",
    panelClass:
      "bg-gradient-to-br from-amber-500/28 via-amber-500/14 to-amber-500/6 dark:from-amber-500/35 dark:via-amber-500/18 dark:to-amber-500/8",
    watermarkClass: "text-amber-600/22 dark:text-amber-400/28",
    accentClass: "text-amber-600 dark:text-amber-400",
    hintClass: "text-amber-900/50 dark:text-amber-100/55",
  },
  {
    key: "bookmarks",
    label: "书签",
    unit: "条",
    hint: "全部链接",
    icon: Bookmark,
    borderClass: "border-emerald-500/35 dark:border-emerald-400/40",
    bgClass:
      "bg-gradient-to-br from-emerald-500/14 via-emerald-500/6 to-emerald-500/10 dark:from-emerald-500/20 dark:via-emerald-500/10 dark:to-emerald-500/14",
    panelClass:
      "bg-gradient-to-br from-emerald-500/28 via-emerald-500/14 to-emerald-500/6 dark:from-emerald-500/35 dark:via-emerald-500/18 dark:to-emerald-500/8",
    watermarkClass: "text-emerald-600/22 dark:text-emerald-400/28",
    accentClass: "text-emerald-600 dark:text-emerald-400",
    hintClass: "text-emerald-900/50 dark:text-emerald-100/55",
  },
];

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

export function AdminStats({ sections, cards, bookmarks }: AdminStatsProps) {
  const values = { sections, cards, bookmarks };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {statItems.map(
        ({
          key,
          label,
          unit,
          hint,
          icon: Icon,
          borderClass,
          bgClass,
          panelClass,
          watermarkClass,
          accentClass,
          hintClass,
        }) => (
          <Card
            key={key}
            className={cn("relative h-full overflow-hidden border p-0 shadow-sm", borderClass)}
          >
            <div className={cn("absolute inset-0", bgClass)} aria-hidden />

            <Icon
              className={cn(
                "pointer-events-none absolute -right-5 -bottom-8 size-36 rotate-12",
                watermarkClass,
              )}
              strokeWidth={1}
              aria-hidden
            />

            <div className="relative flex min-h-28">
              <div
                className={cn(
                  "relative flex w-24 shrink-0 items-center justify-center overflow-hidden border-r",
                  borderClass,
                  panelClass,
                )}
                aria-hidden
              >
                <Icon
                  className={cn("absolute -left-2 size-24 -rotate-12", watermarkClass)}
                  strokeWidth={1.25}
                />
                <Icon
                  className={cn("relative size-8 drop-shadow-sm", accentClass)}
                  strokeWidth={1.75}
                />
              </div>

              <div className="relative flex min-w-0 flex-1 flex-col justify-between p-4 pl-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className={cn("text-sm font-medium tracking-wide", accentClass)}>{label}</p>
                  <p className={cn("shrink-0 text-xs font-medium tracking-wide", hintClass)}>
                    {hint}
                  </p>
                </div>

                <p className="text-[2rem] font-semibold leading-none tracking-tight">
                  <AnimatedStatNumber value={values[key]} />
                  <span className={cn("ml-1.5 text-base font-normal", hintClass)}>{unit}</span>
                </p>
              </div>
            </div>
          </Card>
        ),
      )}
    </div>
  );
}
