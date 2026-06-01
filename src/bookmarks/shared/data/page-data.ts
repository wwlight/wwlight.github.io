/**
 * 功能：导航页 JSON 注水序列化与 DOM 读取。
 * 转义 `<` 防止 `</script>` 打断 HTML 解析。
 */
import type { BookmarkSectionData } from "@/bookmarks/shared/types";

export const BOOKMARK_SECTIONS_DATA_ID = "bookmarks-sections-data";

export function serializeBookmarkSectionsForPage(sections: BookmarkSectionData[]): string {
  return JSON.stringify(sections)
    .replace(/<\//g, "\\u003c/")
    .replace(/<!--/g, "\\u003c!--");
}

export function readBookmarkSectionsFromPage(): BookmarkSectionData[] {
  const el = document.getElementById(BOOKMARK_SECTIONS_DATA_ID);
  if (!el?.textContent) return [];

  try {
    return JSON.parse(el.textContent) as BookmarkSectionData[];
  } catch {
    return [];
  }
}
