import { BackToTop } from "@/components/BackToTop";
import { ThemeProvider } from "@/theme/components/Provider";
import { BookmarksAdminApp, type BookmarksAdminAppProps } from "@/components/admin/BookmarksAdminApp";

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
