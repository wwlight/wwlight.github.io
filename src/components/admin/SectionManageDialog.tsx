import { ChevronDown, Folder, FolderPlus, Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminActionButton } from "@/components/admin/AdminActionButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  cardCanDelete,
  cardIconClass,
  countSectionBookmarks,
  deleteIconClass,
  sectionCanDelete,
} from "@/lib/bookmarks/admin-helpers";
import type { BookmarkSectionData } from "@/lib/bookmarks/types";
import { cn } from "@/lib/utils";

interface SectionManageDialogProps {
  open: boolean;
  sections: BookmarkSectionData[];
  selectedIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
  onAddSection: () => void;
  onEditSection: (index: number) => void;
  onDeleteSection: (index: number) => void;
  onAddCard: (sectionIndex: number) => void;
  onEditCard: (sectionIndex: number, cardIndex: number) => void;
  onDeleteCard: (sectionIndex: number, cardIndex: number) => void;
}

export function SectionManageDialog({
  open,
  sections,
  selectedIndex,
  onClose,
  onSelect,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: SectionManageDialogProps) {
  const [expandedIndex, setExpandedIndex] = useState(selectedIndex);

  useEffect(() => {
    if (open) setExpandedIndex(selectedIndex);
  }, [open, selectedIndex]);

  function handleAddSection() {
    onClose();
    onAddSection();
  }

  function handleEditSection(index: number) {
    onClose();
    onEditSection(index);
  }

  function handleAddCard(sectionIndex: number) {
    onClose();
    onAddCard(sectionIndex);
  }

  function handleEditCard(sectionIndex: number, cardIndex: number) {
    onClose();
    onEditCard(sectionIndex, cardIndex);
  }

  function handleSelectSection(index: number) {
    onSelect(index);
    setExpandedIndex(index);
  }

  function toggleExpanded(index: number) {
    setExpandedIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="flex max-h-[min(85vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="space-y-1 border-b px-6 py-4">
          <DialogTitle>模块与分组管理</DialogTitle>
          <DialogDescription>
            切换模块、管理分组结构。空模块、空分组（无书签）才可删除。
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 border-b px-6 py-3">
          <p className="text-sm text-muted-foreground">共 {sections.length} 个模块</p>
          <Button type="button" size="sm" onClick={handleAddSection}>
            <Plus className="size-4" />
            新增模块
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 app-scrollbar">
          {sections.length === 0 ? (
            <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
              暂无模块，点击「新增模块」开始
            </div>
          ) : (
            <ul className="space-y-1">
              {sections.map((section, index) => {
                const bookmarkCount = countSectionBookmarks(section);
                const cardCount = section.cards.length;
                const canDeleteSection = sectionCanDelete(section);
                const isActive = index === selectedIndex;
                const isExpanded = expandedIndex === index;

                return (
                  <li
                    key={section.title + index}
                    className={cn(
                      "rounded-lg border transition-colors",
                      isActive ? "border-primary/30 bg-primary/5" : "border-transparent",
                    )}
                  >
                    <div className="flex items-center gap-1 px-2 py-2">
                      <button
                        type="button"
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-md",
                          cardIconClass,
                        )}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "收起分组" : "展开分组"}
                        onClick={() => toggleExpanded(index)}
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            !isExpanded && "-rotate-90",
                          )}
                        />
                      </button>

                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        onClick={() => handleSelectSection(index)}
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Layers className="size-4 text-foreground/72" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{section.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {cardCount} 个分组 · {bookmarkCount} 条书签
                          </p>
                        </div>
                        {isActive ? (
                          <Badge variant="secondary" className="shrink-0 text-[10px]">
                            当前
                          </Badge>
                        ) : null}
                      </button>

                      <div className="flex shrink-0 items-center gap-0.5">
                        <AdminActionButton
                          label="删除模块"
                          description={canDeleteSection ? undefined : "模块下有分组或书签，无法删除"}
                          className={cn("size-8", canDeleteSection ? deleteIconClass : "opacity-40")}
                          disabled={!canDeleteSection}
                          onClick={() => onDeleteSection(index)}
                        >
                          <Trash2 className="size-3.5" />
                        </AdminActionButton>
                        <AdminActionButton
                          label="编辑模块"
                          className="size-8"
                          onClick={() => handleEditSection(index)}
                        >
                          <Pencil className="size-3.5" />
                        </AdminActionButton>
                        <AdminActionButton
                          label="新增分组"
                          className="size-8"
                          onClick={() => handleAddCard(index)}
                        >
                          <FolderPlus className="size-3.5" />
                        </AdminActionButton>
                      </div>
                    </div>

                    {isExpanded ? (
                      <div className="space-y-2 border-t border-border/60 px-3 py-3 pl-11">
                        {section.cards.length === 0 ? (
                          <p className="rounded-md border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
                            暂无分组，点击模块右侧「新增分组」
                          </p>
                        ) : (
                          <ul className="space-y-1">
                            {section.cards.map((card, cardIndex) => {
                              const canDeleteCard = cardCanDelete(card);

                              return (
                              <li
                                key={card.title + cardIndex}
                                className="flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 hover:border-border hover:bg-muted/40"
                              >
                                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/80">
                                    <Folder className="size-3.5 text-foreground/72" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm">{card.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {card.bookmarks.length} 条书签
                                    </p>
                                  </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-0.5">
                                  <AdminActionButton
                                    label="删除分组"
                                    description={
                                      canDeleteCard ? undefined : "分组下有书签，无法删除"
                                    }
                                    className={cn(
                                      "size-7",
                                      canDeleteCard ? deleteIconClass : "opacity-40",
                                    )}
                                    disabled={!canDeleteCard}
                                    onClick={() => onDeleteCard(index, cardIndex)}
                                  >
                                    <Trash2 className="size-3.5" />
                                  </AdminActionButton>
                                  <AdminActionButton
                                    label="编辑分组"
                                    className="size-7"
                                    onClick={() => handleEditCard(index, cardIndex)}
                                  >
                                    <Pencil className="size-3.5" />
                                  </AdminActionButton>
                                </div>
                              </li>
                            );
                            })}
                          </ul>
                        )}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
