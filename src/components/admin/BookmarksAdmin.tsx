import { BackToTop } from "@/components/BackToTop";
import { ThemeProvider } from "@/components/theme-provider";
import { BookmarksAdminApp, type BookmarksAdminAppProps } from "@/components/admin/BookmarksAdminApp";

export default function BookmarksAdmin(props: BookmarksAdminAppProps) {
  return (
    <ThemeProvider storageKey="starlight-theme">
      <div className="admin-root min-h-screen">
        <BookmarksAdminApp {...props} />
      </div>
      <BackToTop />
    </ThemeProvider>
  );
}
