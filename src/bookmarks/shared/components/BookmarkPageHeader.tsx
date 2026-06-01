/** 书签页共用顶栏：标题、副标题、右侧操作区 */
import type { ReactNode } from "react";

interface BookmarkPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** 书签导航页 / 管理端共用的顶栏标题区（统计卡片在其下方单独渲染） */
export function BookmarkPageHeader({ title, description, actions }: BookmarkPageHeaderProps) {
  return (
    <header>
      <div className="grid gap-x-4 gap-y-2 md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[auto_auto]">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground md:col-start-1 md:row-start-2">{description}</p>
        ) : (
          <div className="h-5 md:col-start-1 md:row-start-2" aria-hidden />
        )}
        {actions ? (
          <div className="md:col-start-2 md:row-start-1 md:row-span-2 md:self-start">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
