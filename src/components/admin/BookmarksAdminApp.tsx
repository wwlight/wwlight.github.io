import { useEffect, useState } from "react";
import { BookOpen, Bookmark } from "lucide-react";
import { Toaster } from "sonner";
import { AdminApp } from "@/components/admin/AdminApp";
import { AdminGateShell } from "@/components/admin/AdminGateShell";
import { AdminThemeControl } from "@/components/admin/AdminThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  clearSessionToken,
  configureAdminPasswordHash,
  getInitialAdminSession,
  isAdminAuthenticated,
  loginWithPassword,
  storeAdminProfile,
} from "@/lib/bookmarks/admin-auth";
import { readBookmarkSectionsFromPage } from "@/lib/bookmarks/page-data";
import type { BookmarkSectionData } from "@/lib/bookmarks/types";
import { cn } from "@/lib/utils";

export interface BookmarksAdminAppProps {
  isDev: boolean;
  passwordHash: string;
  defaultAdminName?: string;
}

function AdminCardHeader({ title, description }: { title: string; description: string }) {
  return (
    <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
      <div className="space-y-1.5">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <AdminThemeControl className="shrink-0" />
    </CardHeader>
  );
}

function LoginNavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof BookOpen;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon className="size-3.5 shrink-0 opacity-72" aria-hidden />
      <span>{children}</span>
    </a>
  );
}

function bootstrapAdmin(passwordHash: string, defaultAdminName: string) {
  configureAdminPasswordHash(passwordHash);
  return {
    initialSections: readBookmarkSectionsFromPage(),
    session: getInitialAdminSession(defaultAdminName),
  };
}

export function BookmarksAdminApp({
  isDev,
  passwordHash,
  defaultAdminName = "admin",
}: BookmarksAdminAppProps) {
  const [{ initialSections, session }] = useState(() => bootstrapAdmin(passwordHash, defaultAdminName));
  const [authenticated, setAuthenticated] = useState(session.authenticated);
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [passwordShakeKey, setPasswordShakeKey] = useState(0);
  const [userName, setUserName] = useState(session.userName);

  useEffect(() => {
    configureAdminPasswordHash(passwordHash);
  }, [passwordHash]);

  useEffect(() => {
    if (!authenticated) return;

    void isAdminAuthenticated().then((ok) => {
      if (ok) return;
      clearSessionToken();
      setAuthenticated(false);
      setUserName(defaultAdminName);
    });
  }, [authenticated, defaultAdminName]);

  function triggerPasswordError() {
    setPasswordInvalid(true);
    setPasswordShakeKey((key) => key + 1);
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) {
      triggerPasswordError();
      return;
    }

    const ok = await loginWithPassword(trimmed, defaultAdminName);
    if (!ok) {
      triggerPasswordError();
      return;
    }
    storeAdminProfile({ name: defaultAdminName });
    setUserName(defaultAdminName);
    setAuthenticated(true);
  }

  function handleLogout() {
    clearSessionToken();
    window.location.reload();
  }

  if (!passwordHash) {
    return (
      <AdminGateShell>
        <Card className="w-full max-w-md">
          <AdminCardHeader
            title="书签管理后台"
            description="未配置 PUBLIC_BOOKMARKS_ADMIN_HASH，请先设置 .env"
          />
        </Card>
      </AdminGateShell>
    );
  }

  if (authenticated && initialSections.length === 0) {
    return (
      <>
        <Toaster richColors position="bottom-right" />
        <AdminGateShell>
          <Card className="w-full max-w-lg">
            <AdminCardHeader
              title="书签数据为空"
              description="数据库未加载书签。请重启 dev 服务器（vpr dev:admin）以重新 seed，或检查 db/data/bookmarks.ts。"
            />
            <CardFooter>
              <Button variant="outline" asChild>
                <a href="/bookmarks/">返回书签</a>
              </Button>
            </CardFooter>
          </Card>
        </AdminGateShell>
      </>
    );
  }

  if (!authenticated) {
    return (
      <AdminGateShell>
        <Card className="w-full max-w-md">
          <AdminCardHeader title="书签管理后台" description="请输入管理员密码继续" />
          <form noValidate onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div
                key={`password-shake-${passwordShakeKey}`}
                className={cn(passwordInvalid && passwordShakeKey > 0 && "animate-input-shake")}
              >
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  hint="管理员密码"
                  aria-label="管理员密码"
                  invalid={passwordInvalid}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordInvalid(false);
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-0 p-0">
              <div className="w-full px-6 pb-4 pt-0">
                <Button type="submit" className="w-full">
                  登录
                </Button>
              </div>
              <div className="flex w-full items-center justify-end gap-4 border-t border-border/60 px-6 py-3 text-sm">
                <LoginNavLink href="/memorandum/dev-qa/" icon={BookOpen}>
                  返回博客
                </LoginNavLink>
                <LoginNavLink href="/bookmarks/" icon={Bookmark}>
                  返回书签
                </LoginNavLink>
              </div>
            </CardFooter>
          </form>
        </Card>
      </AdminGateShell>
    );
  }

  return (
    <>
      <Toaster richColors position="bottom-right" />
      <AdminApp
        initialSections={initialSections}
        isDev={isDev}
        userName={userName}
        onLogout={handleLogout}
      />
    </>
  );
}
