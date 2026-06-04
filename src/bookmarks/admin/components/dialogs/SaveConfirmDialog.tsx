import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdminDialogLayer } from "@/bookmarks/admin/components/dialogs/AdminDialogLayer";

interface SaveConfirmDialogProps {
  open: boolean;
  summary: string;
  isDev: boolean;
  saving?: boolean;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function SaveConfirmDialog({
  open,
  summary,
  isDev,
  saving,
  confirmLabel,
  onClose,
  onConfirm,
}: SaveConfirmDialogProps) {
  useAdminDialogLayer(open);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && !saving && onClose()}>
      <DialogContent showOverlay={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认保存</DialogTitle>
          <DialogDescription>
            {isDev
              ? "此操作将覆盖 db/data/bookmarks.ts，并自动创建版本备份。"
              : "将导出 bookmarks.ts 文件，请手动替换项目中的源文件。"}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">{summary}</div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            取消
          </Button>
          <Button onClick={onConfirm} disabled={saving}>
            {saving ? "保存中…" : (confirmLabel ?? "确认保存")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
