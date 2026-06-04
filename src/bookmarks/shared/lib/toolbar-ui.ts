/** 导航页与管理端共用的 Tab 列表、搜索框 Tailwind 类 */
export const toolbarControlClass = "h-8";

/** 顶栏搜索框 */
export const toolbarSearchInputClass = "h-8 pl-8 text-xs shadow-sm";

/** 书签模块搜索框 placeholder（管理端与导航页共用） */
export const bookmarkSearchPlaceholder = "搜索模块、分组或书签…";

/** 模块 Tab 列表容器 */
export const sectionTabsListClass =
  "inline-flex h-8 w-max max-w-none flex-nowrap items-center justify-start gap-0.5 bg-muted/80 p-0.5";

/** 模块 Tab 项，比例对齐 Button size="sm" */
export const sectionTabsTriggerClass = "h-7 max-w-48 shrink-0 gap-1.5 px-2.5 py-0 text-xs";

/** 管理端模块 Tab 触发器：无 focus ring/阴影；`data-state-active` 对应 Radix `data-state="active"`（见 shadcn-theme.css） */
export const adminSectionTabsTriggerClass =
  `${sectionTabsTriggerClass} shadow-none hover:bg-background/70 focus-visible:ring-0 focus-visible:ring-offset-0 data-state-active:bg-background data-state-active:text-foreground data-state-active:shadow-none`;

/** Tab 内计数 Badge */
export const sectionTabBadgeClass = "px-1.5 py-0 text-badge";
