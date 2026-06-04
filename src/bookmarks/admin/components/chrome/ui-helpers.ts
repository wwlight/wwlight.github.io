/** 卡片右上角浮动标签 */
export { floatingBadgeClass, bookmarkCardPreviewRowClass as adminBookmarkCardPreviewClass } from "@/bookmarks/shared/lib/card-ui";

/** 书签卡片外壳 */
export const bookmarkCardShellClass = "relative flex flex-col overflow-visible";

/** 管理端书签卡片高度：预览区 h-16 + 底栏 */
export const adminBookmarkCardHeightClass = "min-h-[calc(4rem+2.5rem+1px)]";

/** 书签卡片底部工具栏 */
export const bookmarkCardFooterClass =
  "shrink-0 justify-end border-t bg-muted/30 px-2 py-1.5";

/** 分组标题 */
export const bookmarkGroupTitleClass =
  "min-w-0 flex-1 truncate text-xs font-medium uppercase tracking-wide text-muted-foreground";

/** 分组放置区悬停高亮（见 admin.css，无透明 outline 过渡） */
export const adminDropZoneHoverClass = "admin-drop-zone-hover";

/** 交换/插入目标卡片悬停高亮 */
export const adminDragSwapTargetHoverClass = "admin-drag-swap-target-hover";

export function setAdminDragImage(event: React.DragEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  const clone = element.cloneNode(true) as HTMLElement;
  const computed = getComputedStyle(element);

  clone.style.position = "fixed";
  clone.style.top = "-9999px";
  clone.style.left = "0";
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.opacity = "0.94";
  clone.style.transform = "scale(1.025) rotate(-0.5deg)";
  clone.style.transformOrigin = "center center";
  clone.style.boxShadow =
    "0 20px 40px -12px rgb(0 0 0 / 0.18), 0 8px 16px -8px rgb(0 0 0 / 0.1)";
  clone.style.borderRadius = computed.borderRadius;
  clone.style.backgroundColor = computed.backgroundColor;
  clone.style.pointerEvents = "none";
  clone.style.margin = "0";
  clone.style.zIndex = "9999";
  document.body.appendChild(clone);
  event.dataTransfer.setDragImage(clone, offsetX, offsetY);
  requestAnimationFrame(() => clone.remove());
}
