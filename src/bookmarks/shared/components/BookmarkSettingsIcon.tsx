import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * 书签管理 icon（Lucide bookmark-cog 造型，单 SVG）。
 * @see https://github.com/lucide-icons/lucide/pull/2057
 */
export function BookmarkSettingsIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden
      {...props}
    >
      <path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1" />
      <circle cx="18.5" cy="12.5" r="2.84" />
      <path d="M17.46 9.85 17.08 9" />
      <path d="m19.92 9-.38.85" />
      <path d="m22 11.08-.85.38" />
      <path d="m22 13.92-.85-.38" />
      <path d="m19.92 16-.38-.85" />
      <path d="m17.46 15.15-.38.85" />
      <path d="m15.85 13.54-.85.38" />
      <path d="m15.85 11.46-.85-.38" />
    </svg>
  );
}
