/** 功能：书签卡片站点图标；无 favicon 或加载失败时显示 Lucide Globe。 */
import { Globe } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { faviconCandidates, resolveFaviconFromCandidates } from "@/bookmarks/shared/lib/favicon";
import { cn } from "@/lib/utils";

interface BookmarkFaviconProps extends ComponentPropsWithoutRef<"div"> {
  url: string;
}

export function BookmarkFavicon({ url, className, ...props }: BookmarkFaviconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const candidates = useMemo(() => faviconCandidates(url), [url]);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadedSrc(null);

    if (candidates.length === 0) return;

    function startLoad() {
      void resolveFaviconFromCandidates(candidates).then((src) => {
        if (!cancelled) setLoadedSrc(src);
      });
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      startLoad();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          startLoad();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [url, candidates]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative size-10 shrink-0 overflow-hidden rounded-[0.35rem] bg-muted",
        className,
      )}
      {...props}
    >
      {loadedSrc ? (
        <img
          src={loadedSrc}
          alt=""
          decoding="async"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground/80">
          <Globe aria-hidden className="size-5" strokeWidth={1.75} />
        </div>
      )}
    </div>
  );
}
