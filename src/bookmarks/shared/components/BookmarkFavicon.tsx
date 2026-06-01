import { Globe } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useRef, useState } from "react";
import { faviconUrl } from "@/bookmarks/shared/lib/favicon";
import { cn } from "@/lib/utils";

type FaviconStatus = "idle" | "loaded" | "failed";

interface BookmarkFaviconProps extends ComponentPropsWithoutRef<"div"> {
  url: string;
}

export function BookmarkFavicon({ url, className, ...props }: BookmarkFaviconProps) {
  const iconRef = useRef<HTMLImageElement>(null);
  const icon = faviconUrl(url);
  const [status, setStatus] = useState<FaviconStatus>(() => (icon ? "idle" : "failed"));

  useEffect(() => {
    setStatus(icon ? "idle" : "failed");
  }, [url, icon]);

  useEffect(() => {
    const img = iconRef.current;
    if (!img || !icon || status === "failed") return;

    if (typeof IntersectionObserver === "undefined") {
      img.src = icon;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          img.src = icon;
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [icon, status]);

  const showFallback = status !== "loaded";

  return (
    <div
      className={cn(
        "relative size-10 shrink-0 overflow-hidden rounded-[0.35rem] bg-muted",
        className,
      )}
      {...props}
    >
      {showFallback ? (
        <div className="flex size-full items-center justify-center text-muted-foreground/80">
          <Globe aria-hidden className="size-5" strokeWidth={1.75} />
        </div>
      ) : null}
      {icon && status !== "failed" ? (
        <img
          ref={iconRef}
          alt=""
          decoding="async"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className={cn(
            "size-full object-cover transition-opacity",
            status === "loaded" ? "opacity-100" : "absolute inset-0 opacity-0",
          )}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("failed")}
        />
      ) : null}
    </div>
  );
}
