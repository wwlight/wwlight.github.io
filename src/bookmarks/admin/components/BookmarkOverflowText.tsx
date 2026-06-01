import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface BookmarkOverflowTextProps {
  text: string;
  className?: string;
  as?: "p" | "span";
  enableFocus?: boolean;
}

export function BookmarkOverflowText({
  text,
  className,
  as: Tag = "p",
  enableFocus = true,
}: BookmarkOverflowTextProps) {
  const textRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    function measure() {
      if (!textRef.current) return;
      setOverflow(textRef.current.scrollWidth > textRef.current.clientWidth);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, Tag]);

  function updatePosition() {
    const el = textRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }

  function handleOpen() {
    if (!overflow) return;
    updatePosition();
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  useLayoutEffect(() => {
    if (!overflow) setOpen(false);
  }, [overflow]);

  function setTextRef(node: HTMLParagraphElement | HTMLSpanElement | null) {
    textRef.current = node;
  }

  const textClassName = cn("block truncate", overflow && "cursor-default", className);
  const overflowHandlers = overflow
    ? {
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose,
        ...(enableFocus
          ? { onFocus: handleOpen, onBlur: handleClose, tabIndex: 0 as const }
          : {}),
      }
    : undefined;
  const textElement =
    Tag === "span" ? (
      <span ref={setTextRef} className={textClassName} {...overflowHandlers}>
        {text}
      </span>
    ) : (
      <p ref={setTextRef} className={textClassName} {...overflowHandlers}>
        {text}
      </p>
    );

  return (
    <>
      {textElement}
      {open &&
        overflow &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-auto fixed z-100 max-w-sm rounded-md border border-border bg-popover px-3 py-2 text-xs leading-5 text-popover-foreground shadow-md"
            style={{
              top: position.top,
              left: position.left,
              minWidth: Math.min(Math.max(position.width, 12 * 16), 320),
              maxWidth: 320,
            }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
