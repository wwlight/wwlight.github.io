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

export type DeleteTarget =
  | { type: "section"; sectionIndex: number; title: string }
  | { type: "card"; sectionIndex: number; cardIndex: number; title: string }
  | {
      type: "bookmark";
      sectionIndex: number;
      cardIndex: number;
      bookmarkIndex: number;
      title: string;
    };

function deleteMessage(target: DeleteTarget) {
  if (target.type === "section") return `将删除空模块「${target.title}」，此操作不可撤销。`;
  if (target.type === "card")
    return `将删除空分组「${target.title}」，此操作不可撤销。`;
  return `将删除书签「${target.title}」，此操作不可撤销。`;
}

function deleteTitle(target: DeleteTarget) {
  if (target.type === "section") return "删除模块";
  if (target.type === "card") return "删除分组";
  return "删除书签";
}

interface DeleteConfirmDialogProps {
  target: DeleteTarget | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ target, onClose, onConfirm }: DeleteConfirmDialogProps) {
  useAdminDialogLayer(target != null);

  return (
    <Dialog open={target != null} onOpenChange={(value) => !value && onClose()}>
      <DialogContent showOverlay={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{target ? deleteTitle(target) : "确认删除"}</DialogTitle>
          <DialogDescription>{target ? deleteMessage(target) : ""}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            variant="destructive"
            className="bg-red-500/80 hover:bg-red-500/90"
            onClick={onConfirm}
          >
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
