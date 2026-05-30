import { ExternalLink, GripVertical, Pencil, Trash2 } from "lucide-react";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { CardFooter } from "@/components/ui/card";
import { cardIconClass, deleteIconClass } from "@/lib/bookmarks/admin-helpers";
import { bookmarkCardFooterClass } from "./ui-helpers";
import { cn } from "@/lib/utils";

interface BookmarkCardFooterProps {
  onDragStart: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenLink: () => void;
}

export function BookmarkCardFooter({
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  onOpenLink,
}: BookmarkCardFooterProps) {
  return (
    <CardFooter className={bookmarkCardFooterClass}>
      <AdminActionButton
        label="拖拽排序"
        className={cn("size-7 cursor-grab active:cursor-grabbing", cardIconClass)}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <GripVertical className="size-3.5" />
      </AdminActionButton>
      <div className="flex items-center gap-0.5">
        <AdminActionButton
          label="删除"
          className={cn("size-7", deleteIconClass)}
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" />
        </AdminActionButton>
        <AdminActionButton label="编辑" className={cn("size-7", cardIconClass)} onClick={onEdit}>
          <Pencil className="size-3.5" />
        </AdminActionButton>
        <AdminActionButton
          label="打开链接"
          className={cn("size-7", cardIconClass)}
          onClick={onOpenLink}
        >
          <ExternalLink className="size-3.5" />
        </AdminActionButton>
      </div>
    </CardFooter>
  );
}
