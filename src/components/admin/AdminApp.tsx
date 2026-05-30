import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AdminHeaderActions } from "@/components/admin/AdminHeaderActions";
import { AdminStats } from "@/components/admin/AdminStats";
import { BookmarkAddTile } from "@/components/admin/bookmarks/BookmarkAddTile";
import { BookmarkCard } from "@/components/admin/bookmarks/BookmarkCard";
import { BookmarkCardGroup } from "@/components/admin/bookmarks/BookmarkCardGroup";
import { BookmarkSectionPanel } from "@/components/admin/bookmarks/BookmarkSectionPanel";
import {
  adminDragSwapTargetClass,
  adminDropZoneActiveClass,
} from "@/components/admin/bookmarks/ui-helpers";
import { DeleteConfirmDialog, type DeleteTarget } from "@/components/admin/DeleteConfirmDialog";
import { EditDialog } from "@/components/admin/EditDialog";
import { LeaveUnsavedDialog } from "@/components/admin/LeaveUnsavedDialog";
import { RestoreConfirmDialog } from "@/components/admin/RestoreConfirmDialog";
import { SectionManageDialog } from "@/components/admin/SectionManageDialog";
import { SectionTabsNav } from "@/components/admin/SectionTabsNav";
import { SaveConfirmDialog } from "@/components/admin/SaveConfirmDialog";
import { VersionHistoryDialog } from "@/components/admin/VersionHistoryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { saveSectionsToProject } from "@/lib/bookmarks/admin-api";
import { getAuthorizationHeader } from "@/lib/bookmarks/admin-auth";
import {
  cardCanDelete,
  clampSelectedSection,
  cloneSections,
  countBookmarks,
  type DragPayload,
  type EditContext,
  insertBookmark,
  normalizeSortOrders,
  parseExtraLinksInput,
  sectionCanDelete,
  sectionsEqual,
  STORAGE_KEY,
  swapBookmarks,
} from "@/lib/bookmarks/admin-helpers";
import { downloadTextFile, serializeBookmarkSections } from "@/lib/bookmarks/serialize";
import { getVisibleCardsInSection, sectionMatchesSearch } from "@/lib/bookmarks/search";
import type { BookmarkData, BookmarkSectionData } from "@/lib/bookmarks/types";
import { cn } from "@/lib/utils";

interface AdminAppProps {
  initialSections: BookmarkSectionData[];
  isDev: boolean;
  userName: string;
  onLogout: () => void;
}

function getInsertIndex(
  grid: HTMLElement,
  clientY: number,
  dragging: DragPayload,
  targetSectionIndex: number,
  targetCardIndex: number,
) {
  const cards = [...grid.querySelectorAll<HTMLElement>("[data-bookmark-card]")];
  for (const card of cards) {
    const bookmarkIndex = Number(card.dataset.bookmarkIndex);
    const isSelf =
      dragging.sectionIndex === targetSectionIndex &&
      dragging.cardIndex === targetCardIndex &&
      dragging.bookmarkIndex === bookmarkIndex;
    if (isSelf) continue;

    const rect = card.getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return bookmarkIndex;
  }
  return cards.length;
}

function resolveDropCard(
  grid: HTMLElement,
  clientX: number,
  clientY: number,
  payload: DragPayload,
  targetSectionIndex: number,
  targetCardIndex: number,
) {
  const element = document.elementFromPoint(clientX, clientY);
  const cardEl = element?.closest("[data-bookmark-card]") as HTMLElement | null;
  if (!cardEl || !grid.contains(cardEl)) return null;

  const bookmarkIndex = Number(cardEl.dataset.bookmarkIndex);
  if (Number.isNaN(bookmarkIndex)) return null;

  const isSelf =
    payload.sectionIndex === targetSectionIndex &&
    payload.cardIndex === targetCardIndex &&
    payload.bookmarkIndex === bookmarkIndex;
  if (isSelf) return null;

  return bookmarkIndex;
}

export function AdminApp({ initialSections, isDev, userName, onLogout }: AdminAppProps) {
  const [sections, setSections] = useState<BookmarkSectionData[]>(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        return JSON.parse(draft) as BookmarkSectionData[];
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return cloneSections(initialSections);
  });
  const [savedBaseline, setSavedBaseline] = useState(() => cloneSections(initialSections));
  const [hadDraft] = useState(() => Boolean(localStorage.getItem(STORAGE_KEY)));
  const [selectedSection, setSelectedSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const [editContext, setEditContext] = useState<EditContext | null>(null);
  const [dragPayload, setDragPayload] = useState<DragPayload | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [swapHover, setSwapHover] = useState<DragPayload | null>(null);

  useEffect(() => {
    if (!dragPayload) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [dragPayload]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const pendingLeaveRef = useRef<(() => void) | null>(null);
  const [leaveAfterSave, setLeaveAfterSave] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [sectionManageOpen, setSectionManageOpen] = useState(false);

  useEffect(() => {
    if (hadDraft) toast.message("已恢复本地草稿");
  }, [hadDraft]);

  const hasUnsavedChanges = useMemo(
    () => !sectionsEqual(sections, savedBaseline),
    [sections, savedBaseline],
  );

  const sectionIndex = clampSelectedSection(sections, selectedSection);
  const stats = useMemo(
    () => ({
      sections: sections.length,
      cards: sections.reduce((n, s) => n + s.cards.length, 0),
      bookmarks: countBookmarks(sections),
    }),
    [sections],
  );

  useEffect(() => {
    if (!normalizedSearch) return;

    const matchingIndices = sections
      .map((section, index) => ({ section, index }))
      .filter(({ section }) => sectionMatchesSearch(section, normalizedSearch))
      .map(({ index }) => index);

    if (matchingIndices.length === 0) return;
    if (!matchingIndices.includes(sectionIndex)) {
      setSelectedSection(matchingIndices[0]);
    }
  }, [normalizedSearch, sections, sectionIndex]);

  const persistDraft = useCallback((next: BookmarkSectionData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const updateSections = useCallback(
    (updater: (prev: BookmarkSectionData[]) => BookmarkSectionData[]) => {
      setSections((prev) => {
        const next = updater(cloneSections(prev));
        normalizeSortOrders(next);
        persistDraft(next);
        return next;
      });
    },
    [persistDraft],
  );

  function openEdit(context: EditContext) {
    setEditContext(context);
  }

  function closeEdit() {
    setEditContext(null);
  }

  function handleEditSubmit(data: Record<string, string>) {
    if (!editContext) return;

    const title = data.title?.trim();
    if (!title) return;

    if (editContext.type === "section") {
      updateSections((prev) => {
        if (editContext.sectionIndex >= 0 && editContext.sectionIndex < prev.length) {
          prev[editContext.sectionIndex].title = title;
        } else {
          prev.push({ title, sortOrder: prev.length, stagger: true, cards: [] });
          setSelectedSection(prev.length - 1);
        }
        return prev;
      });
    } else if (editContext.type === "card") {
      updateSections((prev) => {
        const section = prev[editContext.sectionIndex];
        if (editContext.cardIndex != null) {
          section.cards[editContext.cardIndex].title = title;
        } else {
          section.cards.push({ title, sortOrder: section.cards.length, bookmarks: [] });
        }
        return prev;
      });
    } else {
      const url = data.url?.trim();
      if (!url) return;
      const cardIndex = Number(data.cardTitle ?? editContext.cardIndex ?? 0);
      const bookmark: BookmarkData = {
        title,
        url,
        description: data.description?.trim() || undefined,
        badgeText: data.badgeText?.trim() || undefined,
        badgeVariant: data.badgeVariant?.trim() || undefined,
        extraLinks: parseExtraLinksInput(data.extraLinks ?? ""),
        sortOrder: 0,
      };
      updateSections((prev) => {
        const section = prev[editContext.sectionIndex];
        if (editContext.bookmarkIndex != null && editContext.cardIndex != null) {
          section.cards[editContext.cardIndex].bookmarks[editContext.bookmarkIndex] = bookmark;
        } else {
          section.cards[cardIndex].bookmarks.push(bookmark);
        }
        return prev;
      });
    }

    closeEdit();
    toast.success("已保存到本地草稿");
  }

  const saveSummary = useMemo(() => {
    const bookmarkCount = countBookmarks(sections);
    const cardCount = sections.reduce((n, s) => n + s.cards.length, 0);
    return `${sections.length} 个模块、${cardCount} 个分组、${bookmarkCount} 条书签`;
  }, [sections]);

  function openSaveDialog() {
    if (countBookmarks(sections) === 0) {
      toast.error("当前没有书签数据，已阻止保存以免覆盖源文件");
      return;
    }
    setSaveDialogOpen(true);
  }

  function clearPendingLeave() {
    pendingLeaveRef.current = null;
    setLeaveAfterSave(false);
  }

  function closeSaveDialog() {
    if (saving) return;
    setSaveDialogOpen(false);
    if (pendingLeaveRef.current) setLeaveDialogOpen(true);
  }

  async function saveToProject(): Promise<boolean> {
    if (countBookmarks(sections) === 0) {
      toast.error("当前没有书签数据，已阻止保存以免覆盖源文件");
      return false;
    }

    const payload = { sections: cloneSections(sections) };
    normalizeSortOrders(payload.sections);

    setSaving(true);
    try {
      if (isDev) {
        const authorization = await getAuthorizationHeader();
        if (!authorization) throw new Error("登录已过期，请重新登录");

        await saveSectionsToProject(authorization, payload.sections);
        toast.success("已写入 db/data/bookmarks.ts，等待 Astro 重新 seed");
      } else {
        downloadTextFile("bookmarks.ts", serializeBookmarkSections(payload.sections));
        toast.success("已导出 bookmarks.ts，请替换 db/data/bookmarks.ts 后提交");
      }

      localStorage.removeItem(STORAGE_KEY);
      setSavedBaseline(cloneSections(sections));
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function confirmSaveToProject() {
    const ok = await saveToProject();
    if (!ok) return;

    setSaveDialogOpen(false);
    const leave = pendingLeaveRef.current;
    clearPendingLeave();
    leave?.();
  }

  function requestLeave(action: () => void) {
    if (!hasUnsavedChanges) {
      action();
      return;
    }
    pendingLeaveRef.current = action;
    setLeaveAfterSave(true);
    setLeaveDialogOpen(true);
  }

  function closeLeaveDialog() {
    if (saving) return;
    setLeaveDialogOpen(false);
    clearPendingLeave();
  }

  function confirmSaveAndLeave() {
    setLeaveDialogOpen(false);
    if (countBookmarks(sections) === 0) {
      toast.error("当前没有书签数据，已阻止保存以免覆盖源文件");
      setLeaveDialogOpen(true);
      return;
    }
    setSaveDialogOpen(true);
  }

  function confirmLeaveWithoutSave() {
    setLeaveDialogOpen(false);
    const leave = pendingLeaveRef.current;
    clearPendingLeave();
    leave?.();
  }

  function handleReturnToFrontend() {
    requestLeave(() => {
      window.location.href = "/bookmarks/";
    });
  }

  function handleReturnToBlog() {
    requestLeave(() => {
      window.location.href = "/memorandum/dev-qa/";
    });
  }

  function handleLogout() {
    requestLeave(onLogout);
  }

  function applyVersion(sectionsFromVersion: BookmarkSectionData[]) {
    const next = cloneSections(sectionsFromVersion);
    normalizeSortOrders(next);
    setSections(next);
    persistDraft(next);
    setSelectedSection(0);
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    const target = deleteTarget;
    setDeleteTarget(null);

    if (target.type === "section") {
      const section = sections[target.sectionIndex];
      if (section && !sectionCanDelete(section)) {
        toast.error("模块下有分组或书签，无法删除");
        setDeleteTarget(null);
        return;
      }

      updateSections((prev) => {
        prev.splice(target.sectionIndex, 1);
        return prev;
      });
      setSelectedSection((prev) =>
        Math.max(0, prev > target.sectionIndex ? prev - 1 : Math.min(prev, sections.length - 2)),
      );
      toast.success("模块已删除");
      return;
    }

    if (target.type === "card") {
      const card = sections[target.sectionIndex]?.cards[target.cardIndex];
      if (card && !cardCanDelete(card)) {
        toast.error("分组下有书签，无法删除");
        return;
      }

      updateSections((prev) => {
        prev[target.sectionIndex].cards.splice(target.cardIndex, 1);
        return prev;
      });
      toast.success("分组已删除");
      return;
    }

    updateSections((prev) => {
      prev[target.sectionIndex].cards[target.cardIndex].bookmarks.splice(target.bookmarkIndex, 1);
      return prev;
    });
    toast.success("书签已删除");
  }

  function openAddSection() {
    openEdit({ type: "section", sectionIndex: sections.length });
  }

  function requestDeleteSection(sectionIndex: number) {
    const section = sections[sectionIndex];
    if (!section) return;
    if (!sectionCanDelete(section)) {
      toast.error("模块下有分组或书签，无法删除");
      return;
    }
    setDeleteTarget({ type: "section", sectionIndex, title: section.title });
  }

  function requestDeleteCard(sectionIndex: number, cardIndex: number) {
    const card = sections[sectionIndex]?.cards[cardIndex];
    if (!card) return;
    if (!cardCanDelete(card)) {
      toast.error("分组下有书签，无法删除");
      return;
    }
    setDeleteTarget({ type: "card", sectionIndex, cardIndex, title: card.title });
  }

  function confirmRestore() {
    const next = cloneSections(initialSections);
    setSections(next);
    localStorage.removeItem(STORAGE_KEY);
    setSelectedSection(0);
    setRestoreDialogOpen(false);
    toast.success("已恢复初始数据");
  }

  function exportJson() {
    downloadTextFile("bookmarks.json", JSON.stringify(sections, null, 2));
    toast.success("JSON 已导出");
  }

  function importJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      const next = JSON.parse(text) as BookmarkSectionData[];
      normalizeSortOrders(next);
      setSections(next);
      persistDraft(next);
      setSelectedSection(0);
      toast.success("JSON 已导入");
    });
    input.click();
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    targetSectionIndex: number,
    targetCardIndex: number,
  ) {
    event.preventDefault();
    setDropTarget(null);
    setSwapHover(null);

    let payload = dragPayload;
    if (!payload) {
      try {
        payload = JSON.parse(event.dataTransfer.getData("text/plain") || "null") as DragPayload;
      } catch {
        payload = null;
      }
    }
    if (!payload) return;

    const grid = event.currentTarget;
    const dropElement = document.elementFromPoint(event.clientX, event.clientY);
    const droppedOnCard = dropElement?.closest("[data-bookmark-card]") as HTMLElement | null;
    if (droppedOnCard && grid.contains(droppedOnCard)) {
      const droppedIndex = Number(droppedOnCard.dataset.bookmarkIndex);
      if (
        payload.sectionIndex === targetSectionIndex &&
        payload.cardIndex === targetCardIndex &&
        payload.bookmarkIndex === droppedIndex
      ) {
        setDragPayload(null);
        return;
      }
    }

    const swapTargetIndex = resolveDropCard(
      grid,
      event.clientX,
      event.clientY,
      payload,
      targetSectionIndex,
      targetCardIndex,
    );

    updateSections((prev) => {
      const changed =
        swapTargetIndex != null
          ? swapBookmarks(prev, payload!, {
              sectionIndex: targetSectionIndex,
              cardIndex: targetCardIndex,
              bookmarkIndex: swapTargetIndex,
            })
          : insertBookmark(prev, payload!, {
              sectionIndex: targetSectionIndex,
              cardIndex: targetCardIndex,
              bookmarkIndex: getInsertIndex(
                grid,
                event.clientY,
                payload!,
                targetSectionIndex,
                targetCardIndex,
              ),
            });

      if (changed) toast.success("排序已更新");
      return prev;
    });
    setDragPayload(null);
  }

  return (
    <TooltipProvider delayDuration={300}>
    <div className="bookmarks-app min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
      <header className="space-y-4">
        <div className="grid gap-x-4 gap-y-2 md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[auto_auto]">
          <h1 className="text-2xl font-semibold tracking-tight">书签管理后台</h1>
          <p className="text-sm text-muted-foreground md:col-start-1 md:row-start-2">
            {isDev
              ? "开发模式：保存会直接写入 db/data/bookmarks.ts"
              : "静态部署：请导出文件后手动替换并提交"}
          </p>
          <AdminHeaderActions
            className="md:col-start-2 md:row-start-1 md:row-span-2 md:self-start"
            isDev={isDev}
            userName={userName}
            onImportJson={importJson}
            onExportJson={exportJson}
            onOpenVersionHistory={() => setVersionDialogOpen(true)}
            onRestoreInitial={() => setRestoreDialogOpen(true)}
            onSave={openSaveDialog}
            onReturnToFrontend={handleReturnToFrontend}
            onReturnToBlog={handleReturnToBlog}
            onLogout={handleLogout}
          />
        </div>
      </header>

      <AdminStats sections={stats.sections} cards={stats.cards} bookmarks={stats.bookmarks} />

      {sections.length === 0 ? (
        <>
          <SectionTabsNav
            sections={sections}
            selectedIndex={0}
            onSelect={() => {}}
            onOpenSectionManage={() => setSectionManageOpen(true)}
          />
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              暂无模块，点击「结构管理」新增
            </CardContent>
          </Card>
        </>
      ) : (
        <Tabs
          value={String(sectionIndex)}
          onValueChange={(value) => setSelectedSection(Number(value))}
        >
          <SectionTabsNav
            sections={sections}
            selectedIndex={sectionIndex}
            onSelect={setSelectedSection}
            onOpenSectionManage={() => setSectionManageOpen(true)}
            jumpSelect
            query={searchQuery}
            onQueryChange={setSearchQuery}
          />

          {sections.map((section, sIndex) => {
            const visibleCards = getVisibleCardsInSection(section, normalizedSearch);

            return (
            <TabsContent
              key={section.title + sIndex}
              value={String(sIndex)}
              data-section-panel={sIndex}
              className="mt-4"
            >
              <BookmarkSectionPanel section={section}>
                  {visibleCards.length === 0 ? (
                    <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                      {normalizedSearch
                        ? "没有匹配的书签"
                        : "暂无分组，请在「结构管理」中新增分组"}
                    </p>
                  ) : (
                    visibleCards.map(({ card, cardIndex: cIndex, bookmarks: visibleBookmarks }) => (
                      <BookmarkCardGroup
                        key={card.title + cIndex}
                        title={card.title}
                        showTitle={visibleCards.length > 1}
                        gridClassName={cn(
                          "rounded-lg min-h-10 transition-colors",
                          dragPayload && "cursor-grabbing",
                          dropTarget === `${sIndex}-${cIndex}` &&
                            !swapHover &&
                            adminDropZoneActiveClass,
                        )}
                        data-drop-zone
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDropTarget(`${sIndex}-${cIndex}`);
                          if (!dragPayload) return;

                          const hoverIndex = resolveDropCard(
                            e.currentTarget,
                            e.clientX,
                            e.clientY,
                            dragPayload,
                            sIndex,
                            cIndex,
                          );
                          if (hoverIndex != null) {
                            setSwapHover({
                              sectionIndex: sIndex,
                              cardIndex: cIndex,
                              bookmarkIndex: hoverIndex,
                            });
                          } else {
                            setSwapHover(null);
                          }
                        }}
                        onDragLeave={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            setDropTarget(null);
                            setSwapHover(null);
                          }
                        }}
                        onDrop={(e) => handleDrop(e, sIndex, cIndex)}
                      >
                        {visibleBookmarks.map(({ bookmark, bookmarkIndex: bIndex }) => {
                            const isDraggingHost =
                              dragPayload?.sectionIndex === sIndex &&
                              dragPayload?.cardIndex === cIndex &&
                              dragPayload?.bookmarkIndex === bIndex;

                            return (
                              <div
                                key={bookmark.url + bIndex}
                                data-bookmark-card
                                data-bookmark-card-item
                                data-bookmark-index={bIndex}
                                className={cn(
                                  isDraggingHost && "h-auto self-start",
                                  swapHover?.sectionIndex === sIndex &&
                                    swapHover?.cardIndex === cIndex &&
                                    swapHover?.bookmarkIndex === bIndex &&
                                    adminDragSwapTargetClass,
                                )}
                              >
                                <BookmarkCard
                                  bookmark={bookmark}
                                  dragging={isDraggingHost}
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
                                  onDragStart={(e) => {
                                    const payload = {
                                      sectionIndex: sIndex,
                                      cardIndex: cIndex,
                                      bookmarkIndex: bIndex,
                                    };
                                    setDragPayload(payload);
                                    e.dataTransfer.effectAllowed = "move";
                                    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
                                  }}
                                  onDragEnd={() => {
                                    setDragPayload(null);
                                    setDropTarget(null);
                                    setSwapHover(null);
                                  }}
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
        </Tabs>
      )}

      <SectionManageDialog
        open={sectionManageOpen}
        sections={sections}
        selectedIndex={sectionIndex}
        onClose={() => setSectionManageOpen(false)}
        onSelect={setSelectedSection}
        onAddSection={openAddSection}
        onEditSection={(index) => openEdit({ type: "section", sectionIndex: index })}
        onDeleteSection={requestDeleteSection}
        onAddCard={(index) => openEdit({ type: "card", sectionIndex: index })}
        onEditCard={(sectionIndex, cardIndex) =>
          openEdit({ type: "card", sectionIndex, cardIndex })
        }
        onDeleteCard={requestDeleteCard}
      />

      <EditDialog
        open={editContext != null}
        context={editContext}
        sections={sections}
        onClose={closeEdit}
        onSubmit={handleEditSubmit}
      />

      <DeleteConfirmDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <LeaveUnsavedDialog
        open={leaveDialogOpen}
        isDev={isDev}
        summary={saveSummary}
        onClose={closeLeaveDialog}
        onSaveAndLeave={confirmSaveAndLeave}
        onLeaveWithoutSave={confirmLeaveWithoutSave}
      />

      <SaveConfirmDialog
        open={saveDialogOpen}
        summary={saveSummary}
        isDev={isDev}
        saving={saving}
        confirmLabel={leaveAfterSave ? (isDev ? "保存并离开" : "导出并离开") : undefined}
        onClose={closeSaveDialog}
        onConfirm={confirmSaveToProject}
      />

      <RestoreConfirmDialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        onConfirm={confirmRestore}
      />

      <VersionHistoryDialog
        open={versionDialogOpen}
        isDev={isDev}
        getAuthorization={getAuthorizationHeader}
        onClose={() => setVersionDialogOpen(false)}
        onApplyVersion={applyVersion}
      />
      </div>
    </div>
    </TooltipProvider>
  );
}
