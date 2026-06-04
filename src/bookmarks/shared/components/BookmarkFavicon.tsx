/** 功能：书签卡片站点图标（仅 Logo.dev，URL 来自构建期 bookmark-logos.json）。 */
import { Globe } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { resolveBookmarkLogoImageUrl } from "@/bookmarks/shared/lib/bookmark-logos";
import { cn } from "@/lib/utils";

interface BookmarkFaviconProps extends ComponentPropsWithoutRef<"div"> {
  url: string;
}

export function BookmarkFavicon({ url, className, ...props }: BookmarkFaviconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoSrc = useMemo(() => resolveBookmarkLogoImageUrl(url), [url]);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadedSrc(null);
    setFailed(false);

    if (!logoSrc) return;

    const src = logoSrc;

    function startLoad() {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (!cancelled) setLoadedSrc(src);
      };
      img.onerror = () => {
        if (!cancelled) setFailed(true);
      };
      img.src = src;
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
  }, [url, logoSrc]);

  const showImage = loadedSrc && !failed;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative size-10 shrink-0 overflow-hidden rounded-[0.35rem] bg-muted",
        className,
      )}
      {...props}
    >
      {showImage ? (
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
