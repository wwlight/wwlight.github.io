import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { AdminActionButton } from "@/bookmarks/admin/components/AdminActionButton";
import { CardFooter } from "@/components/ui/card";
import { cardIconClass, deleteIconClass } from "@/bookmarks/admin/lib/admin-helpers";
import { bookmarkCardFooterClass } from "./ui-helpers";
import { cn } from "@/lib/utils";

interface BookmarkCardFooterProps {
  onEdit: () => void;
  onDelete: () => void;
  onOpenLink: () => void;
}

export function BookmarkCardFooter({ onEdit, onDelete, onOpenLink }: BookmarkCardFooterProps) {
  return (
    <CardFooter className={bookmarkCardFooterClass}>
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
