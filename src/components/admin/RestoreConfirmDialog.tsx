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

interface RestoreConfirmDialogProps {
  open: boolean;
  summary: string;
  isDev: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RestoreConfirmDialog({
  open,
  summary,
  isDev,
  onClose,
  onConfirm,
}: RestoreConfirmDialogProps) {
  useAdminDialogLayer(open);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent showOverlay={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认恢复</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                {isDev
                  ? "恢复为本页打开时 db/data/bookmarks.ts 的数据。"
                  : "恢复为 db/data/bookmarks.ts 的初始数据。"}
              </p>
              <p>
                同时清除
                <span className="font-semibold">本地草稿</span>
                与
                <span className="font-semibold">中转站</span>
                。
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">{summary}</div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={onConfirm}>确认恢复</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
