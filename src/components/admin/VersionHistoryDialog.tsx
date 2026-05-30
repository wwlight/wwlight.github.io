import { History, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  VersionActionConfirmDialog,
  type VersionActionTarget,
} from "@/components/admin/VersionActionConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchVersionSections,
  fetchVersions,
  restoreVersionToProject,
} from "@/lib/bookmarks/admin-api";
import type { BookmarkSectionData, VersionEntry } from "@/lib/bookmarks/types";

interface VersionHistoryDialogProps {
  open: boolean;
  isDev: boolean;
  getAuthorization: () => Promise<string | null>;
  onClose: () => void;
  onApplyVersion: (sections: BookmarkSectionData[]) => void;
}

function formatVersionTime(createdAt: string) {
  const date = new Date(createdAt);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function VersionHistoryDialog({
  open,
  isDev,
  getAuthorization,
  onClose,
  onApplyVersion,
}: VersionHistoryDialogProps) {
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<VersionActionTarget | null>(null);
  const versionsRef = useRef<VersionEntry[]>([]);
  versionsRef.current = versions;

  const loadVersions = useCallback(async () => {
    if (!isDev) return;
    const silent = versionsRef.current.length > 0;
    if (!silent) setLoading(true);
    try {
      const authorization = await getAuthorization();
      if (!authorization) throw new Error("登录已过期，请重新登录");
      setVersions(await fetchVersions(authorization));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载版本失败");
    } finally {
      setLoading(false);
    }
  }, [getAuthorization, isDev]);

  useEffect(() => {
    if (open) loadVersions();
  }, [open, loadVersions]);

  async function executeUse(id: string) {
    setActingId(id);
    try {
      const authorization = await getAuthorization();
      if (!authorization) throw new Error("登录已过期，请重新登录");
      const sections = await fetchVersionSections(authorization, id);
      onApplyVersion(sections);
      setConfirmTarget(null);
      onClose();
      toast.success("已加载所选版本到编辑器");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载失败");
    } finally {
      setActingId(null);
    }
  }

  async function executeRestore(id: string) {
    setActingId(id);
    try {
      const authorization = await getAuthorization();
      if (!authorization) throw new Error("登录已过期，请重新登录");
      const result = await restoreVersionToProject(authorization, id);
      onApplyVersion(result.sections);
      setConfirmTarget(null);
      onClose();
      toast.success("已恢复版本并写入项目");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "恢复失败");
    } finally {
      setActingId(null);
    }
  }

  function handleConfirmAction() {
    if (!confirmTarget) return;
    if (confirmTarget.action === "use") void executeUse(confirmTarget.version.id);
    else void executeRestore(confirmTarget.version.id);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="size-4" />
              版本记录
            </DialogTitle>
            <DialogDescription>每次保存到项目时自动创建快照，最多保留 40 条。</DialogDescription>
          </DialogHeader>

          <div className="app-scrollbar h-[min(24rem,60vh)] overflow-y-auto overflow-x-hidden rounded-md border">
            {loading ? (
              <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                加载中…
              </div>
            ) : versions.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                暂无版本记录，保存到项目后会自动生成
              </p>
            ) : (
              <ul className="divide-y">
                {versions.map((version) => (
                  <li
                    key={version.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{formatVersionTime(version.createdAt)}</p>
                      <p className="text-xs text-muted-foreground">
                        {version.sectionCount} 模块 · {version.cardCount} 分组 ·{" "}
                        {version.bookmarkCount} 书签
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actingId === version.id}
                        onClick={() => setConfirmTarget({ action: "use", version })}
                      >
                        使用此版本
                      </Button>
                      {isDev && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actingId === version.id}
                          onClick={() => setConfirmTarget({ action: "restore", version })}
                        >
                          写入项目
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {confirmTarget && (
        <VersionActionConfirmDialog
          target={confirmTarget}
          acting={actingId === confirmTarget.version.id}
          onClose={() => setConfirmTarget(null)}
          onConfirm={handleConfirmAction}
        />
      )}
    </>
  );
}
