import type { BookmarkSectionData } from "./types";

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
