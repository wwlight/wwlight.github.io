/**
 * 功能：管理端 TabsContent 书签网格渲染（分组循环、拖拽高亮）。
 * 关联：AdminApp.tsx、useAdminGridDrag.ts、useAdminEditorActions.ts
 */
import { BookmarkAddTile } from "@/bookmarks/admin/components/grid/BookmarkAddTile";
import { BookmarkCard } from "@/bookmarks/admin/components/grid/BookmarkCard";
import { BookmarkCardGroup } from "@/bookmarks/admin/components/grid/BookmarkCardGroup";
import { BookmarkSectionPanel } from "@/bookmarks/admin/components/grid/BookmarkSectionPanel";
import {
  adminDragSwapTargetHoverClass,
  adminDropZoneHoverClass,
} from "@/bookmarks/admin/components/chrome/ui-helpers";
import {
  isGridDragPayload,
  isNoOpGridInsert,
  isStationDragPayload,
  parseDragPayload,
  resolveTransferInsertIndex,
  type GridDragPayload,
} from "@/bookmarks/admin/lib/admin-helpers";
import { resolveDropBookmarkIndex } from "@/bookmarks/admin/lib/admin-grid-dnd";
import { getVisibleCardsInSection } from "@/bookmarks/shared/lib/search";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { useAdminEditorActions } from "./useAdminEditorActions";
import type { useAdminGridDrag } from "./useAdminGridDrag";

interface AdminAppSectionGridProps {
  sections: BookmarkSectionData[];
  sectionsRef: React.MutableRefObject<BookmarkSectionData[]>;
  normalizedSearch: string;
  dragEnabled: boolean;
  gridDrag: ReturnType<typeof useAdminGridDrag>;
  editorActions: ReturnType<typeof useAdminEditorActions>;
}

export function AdminAppSectionGrid({
  sections,
  sectionsRef,
  normalizedSearch,
  dragEnabled,
  gridDrag,
  editorActions,
}: AdminAppSectionGridProps) {
  const {
    dragPayload,
    dropTarget,
    setDropTarget,
    swapHover,
    setSwapHover,
    insertHover,
    setInsertHover,
    handleDrop,
    scheduleClearActiveDragPayload,
    scheduleDragPayloadSync,
    syncDragCardCenterOffset,
    transferFullToastShownRef,
    dragOriginXRef,
    dragOriginYRef,
    dragSessionPayloadRef,
    dragPayloadRef,
    writeDragPayloadData,
  } = gridDrag;

  const { openEdit, setDeleteTarget } = editorActions;

  return (
    <>
      {sections.map((section, sIndex) => {
        const visibleCards = getVisibleCardsInSection(section, normalizedSearch);

        return (
          <TabsContent
            key={section.title + sIndex}
            value={String(sIndex)}
            data-section-panel={sIndex}
            className="mt-4 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <BookmarkSectionPanel section={section}>
              {section.cards.length === 0 ? (
                <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                  暂无分组，请在「结构管理」中新增分组
                </p>
              ) : visibleCards.length === 0 ? (
                <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                  没有匹配的书签
                </p>
              ) : (
                visibleCards.map(({ card, cardIndex: cIndex, bookmarks: visibleBookmarks }) => (
                  <BookmarkCardGroup
                    key={card.title + cIndex}
                    title={card.title}
                    showTitle={visibleCards.length > 1 || visibleBookmarks.length === 0}
                    dropZoneClassName={cn(
                      dragEnabled &&
                        dragPayload &&
                        dropTarget === `${sIndex}-${cIndex}` &&
                        !swapHover &&
                        !insertHover &&
                        adminDropZoneHoverClass,
                    )}
                    gridClassName={cn(
                      "min-h-10",
                      dragEnabled && dragPayload && "cursor-grabbing",
                    )}
                    data-drop-zone
                    onDragOver={
                      dragEnabled
                        ? (e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            const dropKey = `${sIndex}-${cIndex}`;
                            setDropTarget((prev) => (prev === dropKey ? prev : dropKey));
                            const activePayload = parseDragPayload(
                              dragPayloadRef.current ?? dragPayload,
                            );
                            if (!activePayload) return;

                            if (isStationDragPayload(activePayload) || e.shiftKey) {
                              setSwapHover(null);
                              const insertIndex = resolveTransferInsertIndex(
                                e.currentTarget,
                                e.clientX,
                                e.clientY,
                              );
                              const bookmarkCount =
                                sectionsRef.current[sIndex]?.cards[cIndex]?.bookmarks.length ?? 0;
                              if (
                                isGridDragPayload(activePayload) &&
                                isNoOpGridInsert(
                                  activePayload,
                                  {
                                    sectionIndex: sIndex,
                                    cardIndex: cIndex,
                                    bookmarkIndex: insertIndex,
                                  },
                                  bookmarkCount,
                                )
                              ) {
                                setInsertHover(null);
                              } else {
                                setInsertHover({
                                  sectionIndex: sIndex,
                                  cardIndex: cIndex,
                                  bookmarkIndex: insertIndex,
                                });
                              }
                              return;
                            }

                            setInsertHover(null);
                            const hoverIndex = isGridDragPayload(activePayload)
                              ? resolveDropBookmarkIndex(
                                  e.currentTarget,
                                  e.clientX,
                                  e.clientY,
                                  activePayload,
                                  sIndex,
                                  cIndex,
                                )
                              : null;
                            if (hoverIndex != null) {
                              setSwapHover({
                                sectionIndex: sIndex,
                                cardIndex: cIndex,
                                bookmarkIndex: hoverIndex,
                              });
                            } else {
                              setSwapHover(null);
                            }
                          }
                        : undefined
                    }
                    onDragLeave={
                      dragEnabled
                        ? (e) => {
                            const related = e.relatedTarget as Node | null;
                            if (related == null) return;
                            if (e.currentTarget.contains(related)) return;
                            setDropTarget(null);
                            setSwapHover(null);
                            setInsertHover(null);
                          }
                        : undefined
                    }
                    onDrop={dragEnabled ? (e) => handleDrop(e, sIndex, cIndex) : undefined}
                  >
                    {visibleBookmarks.map(({ bookmark, bookmarkIndex: bIndex }) => {
                      const activePayload = parseDragPayload(dragPayload);
                      const isDraggingHost =
                        activePayload != null &&
                        isGridDragPayload(activePayload) &&
                        activePayload.sectionIndex === sIndex &&
                        activePayload.cardIndex === cIndex &&
                        activePayload.bookmarkIndex === bIndex;

                      const isSwapTarget =
                        dragEnabled &&
                        dragPayload != null &&
                        isGridDragPayload(dragPayload) &&
                        swapHover?.sectionIndex === sIndex &&
                        swapHover?.cardIndex === cIndex &&
                        swapHover?.bookmarkIndex === bIndex;
                      const isInsertTarget =
                        dragEnabled &&
                        dragPayload != null &&
                        insertHover?.sectionIndex === sIndex &&
                        insertHover?.cardIndex === cIndex &&
                        insertHover?.bookmarkIndex === bIndex;

                      return (
                        <div
                          key={bookmark.url + bIndex}
                          data-bookmark-card
                          data-bookmark-card-item
                          data-bookmark-index={bIndex}
                          className={cn(
                            (isSwapTarget || isInsertTarget) && adminDragSwapTargetHoverClass,
                          )}
                        >
                          <BookmarkCard
                            bookmark={bookmark}
                            dragging={isDraggingHost}
                            dragEnabled={dragEnabled}
                            onEdit={() =>
                              openEdit({
                                type: "bookmark",
                                sectionIndex: sIndex,
                                cardIndex: cIndex,
                                bookmarkIndex: bIndex,
                              })
                            }
                            onDelete={() =>
                              setDeleteTarget({
                                type: "bookmark",
                                sectionIndex: sIndex,
                                cardIndex: cIndex,
                                bookmarkIndex: bIndex,
                                title: bookmark.title,
                              })
                            }
                            onDragStart={
                              dragEnabled
                                ? (e) => {
                                    const payload: GridDragPayload = {
                                      source: "grid",
                                      sectionIndex: sIndex,
                                      cardIndex: cIndex,
                                      bookmarkIndex: bIndex,
                                    };
                                    dragSessionPayloadRef.current = payload;
                                    dragPayloadRef.current = payload;
                                    dragOriginXRef.current = e.clientX;
                                    dragOriginYRef.current = e.clientY;
                                    transferFullToastShownRef.current = false;
                                    syncDragCardCenterOffset(e);
                                    e.dataTransfer.effectAllowed = "move";
                                    writeDragPayloadData(e.dataTransfer, payload);
                                    scheduleDragPayloadSync(payload);
                                  }
                                : () => {}
                            }
                            onDragEnd={dragEnabled ? scheduleClearActiveDragPayload : () => {}}
                          />
                        </div>
                      );
                    })}
                    <BookmarkAddTile
                      onClick={() =>
                        openEdit({
                          type: "bookmark",
                          sectionIndex: sIndex,
                          cardIndex: cIndex,
                        })
                      }
                    />
                  </BookmarkCardGroup>
                ))
              )}
            </BookmarkSectionPanel>
          </TabsContent>
        );
      })}
    </>
  );
}
