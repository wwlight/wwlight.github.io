import { useEffect, useState } from "react";
import { BookOpen, Bookmark, LockKeyhole } from "lucide-react";
import { BookmarkSettingsIcon } from "@/bookmarks/shared/components/BookmarkSettingsIcon";
import { Toaster } from "sonner";
import { AdminApp } from "@/bookmarks/admin/components/AdminApp";
import { AdminGateShell } from "@/bookmarks/admin/components/AdminGateShell";
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
  ADMIN_DISPLAY_NAME,
  clearSessionToken,
  configureAdminPasswordHash,
  getInitialAdminSession,
  isAdminAuthenticated,
  loginWithPassword,
} from "@/bookmarks/admin/lib/admin-auth";
import { readBookmarkSectionsFromPage } from "@/bookmarks/shared/data/page-data";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { cn } from "@/lib/utils";

export interface BookmarksAdminAppProps {
  isDev: boolean;
  passwordHash: string;
}

function GateCardHeader({ title, description }: { title: string; description: string }) {
  return (
    <CardHeader className="space-y-1.5 pb-2 text-center">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
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

function bootstrapAdmin(passwordHash: string) {
  configureAdminPasswordHash(passwordHash);
  return {
    initialSections: readBookmarkSectionsFromPage(),
    session: getInitialAdminSession(),
  };
}

export function BookmarksAdminApp({
  isDev,
  passwordHash,
}: BookmarksAdminAppProps) {
  const [{ initialSections, session }] = useState(() => bootstrapAdmin(passwordHash));
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
      setUserName(ADMIN_DISPLAY_NAME);
    });
  }, [authenticated]);

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

    const ok = await loginWithPassword(trimmed);
    if (!ok) {
      triggerPasswordError();
      return;
    }
    setUserName(ADMIN_DISPLAY_NAME);
    setAuthenticated(true);
  }

  function handleLogout() {
    clearSessionToken();
    window.location.reload();
  }

  if (!passwordHash) {
    return (
      <AdminGateShell>
        <Card className="border-border/70 shadow-xl">
          <GateCardHeader
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
          <Card className="border-border/70 shadow-xl">
            <GateCardHeader
              title="书签数据为空"
              description="数据库未加载书签。请重启 dev 服务器（vpr dev:admin）以重新 seed，或检查 db/data/bookmarks.ts。"
            />
            <CardFooter className="justify-center pb-6">
              <Button variant="outline" asChild>
                <a href="/bookmarks/nav/">返回书签</a>
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
        <Card className="overflow-hidden border-border/70 shadow-xl">
          <div className="border-b border-border/60 bg-muted/30 px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <BookmarkSettingsIcon className="size-7" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">书签管理后台</h1>
            <p className="mt-2 text-sm text-muted-foreground">登录以管理本地书签数据</p>
          </div>
          <form noValidate onSubmit={handleLogin}>
            <CardContent className="space-y-4 px-6 pb-5 pt-5">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <LockKeyhole className="size-4 shrink-0 opacity-70" aria-hidden />
                <span>请输入管理员密码</span>
              </div>
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
                  className="h-10"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordInvalid(false);
                  }}
                />
              </div>
              {passwordInvalid && (
                <p className="text-sm text-destructive" role="alert">
                  密码错误或为空，请重试
                </p>
              )}
              <Button type="submit" className="h-10 w-full">
                登录
              </Button>
            </CardContent>
            <CardFooter className="flex-col gap-0 p-0">
              <div className="flex w-full items-center justify-center gap-6 border-t border-border/60 bg-muted/20 px-6 py-3.5 text-sm">
                <LoginNavLink href="/blog/" icon={BookOpen}>
                  返回博客
                </LoginNavLink>
                <LoginNavLink href="/bookmarks/nav/" icon={Bookmark}>
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
