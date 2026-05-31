import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdminDialogLayer } from "@/components/admin/AdminDialogLayer";
import type { VersionEntry } from "@/lib/bookmarks/types";

export type VersionAction = "use" | "restore";

export interface VersionActionTarget {
  action: VersionAction;
  version: VersionEntry;
}

function formatVersionTime(createdAt: string) {
  return new Date(createdAt).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function versionSummary(version: VersionEntry) {
  return `${version.sectionCount} 个模块、${version.cardCount} 个分组、${version.bookmarkCount} 条书签`;
}

interface VersionActionConfirmDialogProps {
  target: VersionActionTarget | null;
  acting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function VersionActionConfirmDialog({
  target,
  acting,
  onClose,
  onConfirm,
}: VersionActionConfirmDialogProps) {
  useAdminDialogLayer(target != null);
  const isRestore = target?.action === "restore";

  return (
    <Dialog open={target != null} onOpenChange={(value) => !value && onClose()}>
      <DialogContent showOverlay={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRestore ? "确认写入项目" : "确认使用此版本"}</DialogTitle>
          <DialogDescription>
            {isRestore
              ? "此操作将覆盖 db/data/bookmarks.ts，并触发 Astro 重新 seed。"
              : "将把所选版本加载到编辑器，当前未保存的草稿会被替换。"}
          </DialogDescription>
        </DialogHeader>
        {target && (
          <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm space-y-1">
            <p>{formatVersionTime(target.version.createdAt)}</p>
            <p className="text-muted-foreground">{versionSummary(target.version)}</p>
          </div>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={acting}>
            取消
          </Button>
          <Button onClick={onConfirm} disabled={acting}>
            {acting ? "处理中…" : isRestore ? "确认写入" : "确认使用"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
