import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "@/styles/back-to-top.css";

const THRESHOLD = 300;

function getScrollTop() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const update = () => setVisible(getScrollTop() > THRESHOLD);

    update();
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("astro:page-load", update);
    document.addEventListener("astro:after-swap", update);

    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("astro:page-load", update);
      document.removeEventListener("astro:after-swap", update);
    };
  }, []);

  if (!mounted)
    return null;

  return createPortal(
    <button
      type="button"
      aria-label="回到顶部"
      data-visible={visible}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="back-to-top-btn inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-md backdrop-blur-sm"
    >
      <ArrowUp className="size-4" aria-hidden />
    </button>,
    document.body,
  );
}
