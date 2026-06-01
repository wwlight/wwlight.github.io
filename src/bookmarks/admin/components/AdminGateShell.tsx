import type { ReactNode } from "react";
import { ColorThemePicker } from "@/theme/components/ColorThemePicker";

/** 登录 / 配置 / 空数据等门禁页的居中容器 */
export function AdminGateShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--muted)_40%,transparent))]"
        aria-hidden
      />
      <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
        <ColorThemePicker />
      </div>
      <div className="relative z-[1] w-full max-w-md">{children}</div>
    </div>
  );
}
