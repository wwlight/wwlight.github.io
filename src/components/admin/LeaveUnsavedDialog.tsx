import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LeaveUnsavedDialogProps {
  open: boolean;
  isDev: boolean;
  summary: string;
  onClose: () => void;
  onSaveAndLeave: () => void;
  onLeaveWithoutSave: () => void;
}

export function LeaveUnsavedDialog({
  open,
  isDev,
  summary,
  onClose,
  onSaveAndLeave,
  onLeaveWithoutSave,
}: LeaveUnsavedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>未保存的修改</DialogTitle>
          <DialogDescription>
            你有尚未保存到项目的修改。离开前是否先
            {isDev ? "保存到项目" : "导出 bookmarks.ts"}？
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">{summary}</div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            继续编辑
          </Button>
          <Button variant="outline" onClick={onLeaveWithoutSave}>
            不保存离开
          </Button>
          <Button onClick={onSaveAndLeave}>
            {isDev ? "保存并离开" : "导出并离开"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
