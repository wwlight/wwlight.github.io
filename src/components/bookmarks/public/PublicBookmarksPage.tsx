import { BackToTop } from "@/components/BackToTop";
import { ThemeProvider } from "@/components/theme-provider";
import { BookmarksPublic } from "@/components/bookmarks/public/BookmarksPublic";
import { PublicPageActions } from "@/components/bookmarks/public/PublicPageActions";
import { readBookmarkSectionsFromPage } from "@/lib/bookmarks/page-data";
import { useState } from "react";

export function PublicBookmarksPage({ firstBlogPostHref }: { firstBlogPostHref: string }) {
  const [sections] = useState(readBookmarkSectionsFromPage);

  return (
    <ThemeProvider storageKey="starlight-theme">
      <div className="bookmarks-public min-h-screen p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <BookmarksPublic sections={sections} actions={<PublicPageActions blogHref={firstBlogPostHref} />} />
        </div>
      </div>
      <BackToTop />
    </ThemeProvider>
  );
}
