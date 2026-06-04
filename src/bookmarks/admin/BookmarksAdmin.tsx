import { BackToTop } from "@/components/BackToTop";
import { ThemeProvider } from "@/theme/components/color-mode/Provider";
import { BookmarksAdminApp, type BookmarksAdminAppProps } from "@/bookmarks/admin/BookmarksAdminApp";

export default function BookmarksAdmin(props: BookmarksAdminAppProps) {
  return (
    <ThemeProvider>
      <div className="admin-root min-h-screen">
        <BookmarksAdminApp {...props} />
      </div>
      <BackToTop />
    </ThemeProvider>
  );
}
