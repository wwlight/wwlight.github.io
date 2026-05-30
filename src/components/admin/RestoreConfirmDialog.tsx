import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RestoreConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RestoreConfirmDialog({ open, onClose, onConfirm }: RestoreConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>恢复初始数据</DialogTitle>
          <DialogDescription>
            将放弃本地草稿并恢复为页面加载时的初始数据，未保存的修改会丢失，此操作不可撤销。
          </DialogDescription>
        </DialogHeader>
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
