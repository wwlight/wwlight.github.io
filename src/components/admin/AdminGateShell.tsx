import type { ReactNode } from "react";

/** 登录 / 配置 / 空数据等门禁页的居中容器 */
export function AdminGateShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center p-4">{children}</div>;
}
