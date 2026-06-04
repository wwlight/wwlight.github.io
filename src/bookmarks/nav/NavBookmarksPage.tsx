/** 书签导航页 React 根：ThemeProvider + JSON 注水数据 */
import { BackToTop } from "@/components/BackToTop";
import { ThemeProvider } from "@/theme/components/color-mode/Provider";
import { NavBookmarks } from "@/bookmarks/nav/NavBookmarks";
import { NavPageActions } from "@/bookmarks/nav/components/chrome/NavPageActions";
import { readBookmarkSectionsFromPage } from "@/bookmarks/shared/data/page-data";
import { useState } from "react";

export function NavBookmarksPage() {
  const [sections] = useState(readBookmarkSectionsFromPage);

  return (
    <ThemeProvider>
      <div className="bookmarks-nav min-h-screen p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <NavBookmarks sections={sections} actions={<NavPageActions />} />
        </div>
      </div>
      <BackToTop />
    </ThemeProvider>
  );
}
