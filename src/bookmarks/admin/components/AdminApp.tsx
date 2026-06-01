/** 管理端主编辑界面：CRUD、拖拽、对话框、脏检测 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AdminHeaderActions } from "@/bookmarks/admin/components/AdminHeaderActions";
import { BookmarkStatsCards } from "@/bookmarks/shared/components/BookmarkStatsCards";
import { BookmarkPageHeader } from "@/bookmarks/shared/components/BookmarkPageHeader";
import { countBookmarkStats } from "@/bookmarks/shared/lib/stats";
import { BookmarkAddTile } from "@/bookmarks/admin/components/BookmarkAddTile";
import { BookmarkCard } from "@/bookmarks/admin/components/BookmarkCard";
import { BookmarkCardGroup } from "@/bookmarks/admin/components/BookmarkCardGroup";
import { DragTransferStation } from "@/bookmarks/admin/components/DragTransferStation";
import { BookmarkSectionPanel } from "@/bookmarks/admin/components/BookmarkSectionPanel";
import {
  adminDragSwapTargetHoverClass,
  adminDropZoneHoverClass,
} from "@/bookmarks/admin/components/ui-helpers";
import { DeleteConfirmDialog, type DeleteTarget } from "@/bookmarks/admin/components/DeleteConfirmDialog";
import { AdminDialogProvider } from "@/bookmarks/admin/components/AdminDialogLayer";
import { EditDialog } from "@/bookmarks/admin/components/EditDialog";
import { LeaveUnsavedDialog } from "@/bookmarks/admin/components/LeaveUnsavedDialog";
import { RestoreConfirmDialog } from "@/bookmarks/admin/components/RestoreConfirmDialog";
import { SectionManageDialog } from "@/bookmarks/admin/components/SectionManageDialog";
import { SectionTabsNav } from "@/bookmarks/admin/components/SectionTabsNav";
import { SaveConfirmDialog } from "@/bookmarks/admin/components/SaveConfirmDialog";
import { VersionHistoryDialog } from "@/bookmarks/admin/components/VersionHistoryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { saveSectionsToProject } from "@/bookmarks/admin/lib/admin-api";
import { getAuthorizationHeader } from "@/bookmarks/admin/lib/admin-auth";
import {
  cardCanDelete,
  clampSelectedSection,
  cloneSections,
  countBookmarks,
  type DragPayload,
  type EditContext,
  type GridDragPayload,
  insertBookmark,
  insertTransferBookmark,
  isGridDragPayload,
  isStationDragPayload,
  loadTransferStationItems,
  loadTransferStationDock,
  normalizeSortOrders,
  parseDragPayload,
  parseExtraLinksInput,
  persistTransferStationDock,
  persistTransferStationItems,
  clearTransferStationStorage,
  readDragPayloadData,
  restoreTransferBookmark,
  resolveTransferInsertIndex,
  resolveTransferStationSide,
  sectionCanDelete,
  sectionsEqual,
  STORAGE_KEY,
  swapBookmarks,
  takeBookmarkForTransfer,
  transferStationHasBookmark,
  type StationDragPayload,
  type TransferStationItem,
  type TransferStationSide,
  writeDragPayloadData,
} from "@/bookmarks/admin/lib/admin-helpers";
import { downloadTextFile, serializeBookmarkSections } from "@/bookmarks/shared/data/serialize";
import { getVisibleCardsInSection, sectionMatchesSearch } from "@/bookmarks/shared/lib/search";
import type { BookmarkData, BookmarkSectionData } from "@/bookmarks/shared/types";
import { migrateAllLegacyStorageKeys } from "@/lib/site-storage";
import { cn } from "@/lib/utils";
import { useAdminDragEnabled } from "@/lib/use-admin-drag-enabled";

interface AdminAppProps {
  initialSections: BookmarkSectionData[];
  isDev: boolean;
  userName: string;
  onLogout: () => void;
}

interface BookmarkDragTarget {
  sectionIndex: number;
  cardIndex: number;
  bookmarkIndex: number;
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
    if (isGridDragPayload(dragging)) {
      const isSelf =
        dragging.sectionIndex === targetSectionIndex &&
        dragging.cardIndex === targetCardIndex &&
        dragging.bookmarkIndex === bookmarkIndex;
      if (isSelf) continue;
    }

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
  if (isStationDragPayload(payload)) return null;

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

export function AdminApp({
  initialSections,
  isDev,
  userName,
  onLogout,
}: AdminAppProps) {
  const [sections, setSections] = useState<BookmarkSectionData[]>(() => {
    migrateAllLegacyStorageKeys();
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
  const [hadDraft] = useState(() => {
    migrateAllLegacyStorageKeys();
    return Boolean(localStorage.getItem(STORAGE_KEY));
  });
  const [selectedSection, setSelectedSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const [editContext, setEditContext] = useState<EditContext | null>(null);
  const [dragPayload, setDragPayload] = useState<DragPayload | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [swapHover, setSwapHover] = useState<BookmarkDragTarget | null>(null);
  const [insertHover, setInsertHover] = useState<BookmarkDragTarget | null>(null);
  const [transferItems, setTransferItems] = useState<TransferStationItem[]>(() => {
    migrateAllLegacyStorageKeys();
    return loadTransferStationItems();
  });
  const [hadTransferDraft] = useState(() => loadTransferStationItems().length > 0);
  const [transferDropActive, setTransferDropActive] = useState(false);
  const [stationReveal, setStationReveal] = useState(false);
  const [stationSide, setStationSide] = useState<TransferStationSide>(
    () => loadTransferStationDock().side,
  );
  const [dragApproachSide, setDragApproachSide] = useState<TransferStationSide | null>(null);
  const dragPayloadRef = useRef<DragPayload | null>(null);
  const dragSessionPayloadRef = useRef<DragPayload | null>(null);
  const dragOriginXRef = useRef<number | null>(null);
  const dragOriginYRef = useRef<number | null>(null);
  const stationPanelRef = useRef<HTMLElement | null>(null);
  const transferItemsRef = useRef(transferItems);
  const sectionsRef = useRef(sections);
  const dragEnabled = useAdminDragEnabled();

  transferItemsRef.current = transferItems;
  sectionsRef.current = sections;

  function replaceTransferItems(next: TransferStationItem[]) {
    persistTransferStationItems(next);
    setTransferItems(next);
  }

  function appendTransferItem(item: TransferStationItem) {
    if (transferStationHasBookmark(transferItemsRef.current, item.bookmark.url)) {
      return false;
    }
    replaceTransferItems([...transferItemsRef.current, item]);
    return true;
  }

  function removeTransferItemFromState(id: string) {
    replaceTransferItems(transferItemsRef.current.filter((entry) => entry.id !== id));
  }

  function findTransferItem(id: string) {
    return transferItemsRef.current.find((entry) => entry.id === id) ?? null;
  }

  function handleStationSideChange(next: TransferStationSide) {
    setStationSide(next);
    const dock = loadTransferStationDock();
    persistTransferStationDock({ ...dock, side: next });
  }

  const forceStationExpanded =
    transferItems.length > 0 ||
    transferDropActive ||
    stationReveal ||
    (Boolean(dragPayload && isGridDragPayload(dragPayload)) && dragApproachSide === stationSide);
  const draggingStationItemId =
    dragPayload && isStationDragPayload(dragPayload) ? dragPayload.itemId : null;

  function setActiveDragPayload(payload: DragPayload | null) {
    dragSessionPayloadRef.current = payload;
    dragPayloadRef.current = payload;
    setDragPayload(payload);
  }

  function clearActiveDragPayload() {
    disableStationDropPassthrough();
    dragSessionPayloadRef.current = null;
    dragPayloadRef.current = null;
    dragOriginXRef.current = null;
    dragOriginYRef.current = null;
    setDragPayload(null);
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);
    setTransferDropActive(false);
    setDragApproachSide(null);
  }

  function clearDragUiState() {
    dragPayloadRef.current = null;
    setDragPayload(null);
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);
    setTransferDropActive(false);
    setDragApproachSide(null);
  }

  function scheduleClearActiveDragPayload() {
    requestAnimationFrame(() => {
      clearDragUiState();
    });
  }

  function readDragPayload(event: React.DragEvent): DragPayload | null {
    return (
      parseDragPayload(dragSessionPayloadRef.current) ??
      readDragPayloadData(event.dataTransfer) ??
      parseDragPayload(dragPayloadRef.current ?? dragPayload)
    );
  }

  useEffect(() => {
    if (!dragPayload) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [dragPayload]);

  useEffect(() => {
    if (!dragEnabled || !dragPayload) {
      setDragApproachSide(null);
      return;
    }
    if (!isGridDragPayload(dragPayload) && !isStationDragPayload(dragPayload)) {
      setDragApproachSide(null);
      return;
    }

    function onDragOver(event: DragEvent) {
      event.preventDefault();

      const originX = dragOriginXRef.current;
      const originY = dragOriginYRef.current;
      if (originX == null || originY == null) return;

      const resolvedSide = resolveTransferStationSide(
        event.clientX,
        event.clientY,
        originX,
        originY,
        window.innerWidth,
        window.innerHeight,
      );

      if (resolvedSide) {
        handleStationSideChange(resolvedSide);
        if (isGridDragPayload(dragPayloadRef.current ?? dragPayload)) {
          setStationReveal(true);
        }
        setDragApproachSide(resolvedSide);
        return;
      }

      const deltaX = event.clientX - originX;
      const deltaY = event.clientY - originY;
      if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        if (deltaX <= -20) setDragApproachSide("left");
        else if (deltaX >= 20) setDragApproachSide("right");
        else setDragApproachSide(null);
      } else {
        if (deltaY <= -20) setDragApproachSide("top");
        else if (deltaY >= 20) setDragApproachSide("bottom");
        else setDragApproachSide(null);
      }
    }

    document.addEventListener("dragover", onDragOver);
    return () => {
      document.removeEventListener("dragover", onDragOver);
      setDragApproachSide(null);
    };
  }, [dragPayload, dragEnabled]);

  useEffect(() => {
    if (dragPayload) return;
    setStationReveal(false);
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

  useEffect(() => {
    if (hadTransferDraft) toast.message("已恢复中转站暂存");
  }, [hadTransferDraft]);

  const hasUnsavedChanges = useMemo(
    () => !sectionsEqual(sections, savedBaseline),
    [sections, savedBaseline],
  );

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  const sectionIndex = clampSelectedSection(sections, selectedSection);
  const stats = useMemo(() => countBookmarkStats(sections), [sections]);

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

  const initialSummary = useMemo(() => {
    const bookmarkCount = countBookmarks(initialSections);
    const cardCount = initialSections.reduce((n, s) => n + s.cards.length, 0);
    return `${initialSections.length} 个模块、${cardCount} 个分组、${bookmarkCount} 条书签`;
  }, [initialSections]);

  function openSaveDialog() {
    if (countBookmarks(buildSectionsForSave()) === 0) {
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
    const restoredTransferCount = transferItemsRef.current.length;
    const sectionsToSave = buildSectionsForSave();

    if (countBookmarks(sectionsToSave) === 0) {
      toast.error("当前没有书签数据，已阻止保存以免覆盖源文件");
      return false;
    }

    setSaving(true);
    try {
      if (isDev) {
        const authorization = await getAuthorizationHeader();
        if (!authorization) throw new Error("登录已过期，请重新登录");

        await saveSectionsToProject(authorization, sectionsToSave);
        toast.success(
          restoredTransferCount > 0
            ? `已写入 db/data/bookmarks.ts（${restoredTransferCount} 个中转站书签已还原原分组）`
            : "已写入 db/data/bookmarks.ts，等待 Astro 重新 seed",
        );
      } else {
        downloadTextFile("bookmarks.ts", serializeBookmarkSections(sectionsToSave));
        toast.success(
          restoredTransferCount > 0
            ? `已导出 bookmarks.ts（${restoredTransferCount} 个中转站书签已还原原分组）`
            : "已导出 bookmarks.ts，请替换 db/data/bookmarks.ts 后提交",
        );
      }

      localStorage.removeItem(STORAGE_KEY);
      replaceTransferItems([]);
      const saved = cloneSections(sectionsToSave);
      setSections(saved);
      setSavedBaseline(saved);
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
      restoreAllTransferItemsToSections();
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
    if (countBookmarks(buildSectionsForSave()) === 0) {
      toast.error("当前没有书签数据，已阻止保存以免覆盖源文件");
      return;
    }
    setSaveDialogOpen(true);
    setLeaveDialogOpen(false);
  }

  function confirmLeaveWithoutSave() {
    setLeaveDialogOpen(false);
    restoreAllTransferItemsToSections();
    const leave = pendingLeaveRef.current;
    clearPendingLeave();
    leave?.();
  }

  function handleReturnToFrontend() {
    requestLeave(() => {
      window.location.href = "/bookmarks/nav/";
    });
  }

  function handleReturnToBlog() {
    requestLeave(() => {
      window.location.href = "/blog/";
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
    clearTransferStationStorage();
    replaceTransferItems([]);
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
      clearTransferStationStorage();
      replaceTransferItems([]);
      setSelectedSection(0);
      toast.success("JSON 已导入");
    });
    input.click();
  }

  function handleTransferStationDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setTransferDropActive(false);

    const payload = readDragPayload(event);
    if (!payload || !isGridDragPayload(payload)) return;

    const sourceBookmark =
      sectionsRef.current[payload.sectionIndex]?.cards[payload.cardIndex]?.bookmarks[
        payload.bookmarkIndex
      ];
    if (!sourceBookmark) return;

    if (transferStationHasBookmark(transferItemsRef.current, sourceBookmark.url)) {
      toast.message("该书签已在中转站中");
      clearActiveDragPayload();
      return;
    }

    const next = cloneSections(sectionsRef.current);
    const bookmark = takeBookmarkForTransfer(next, payload);
    if (!bookmark) return;

    const item: TransferStationItem = {
      id: crypto.randomUUID(),
      bookmark,
      from: payload,
    };

    normalizeSortOrders(next);
    persistDraft(next);
    setSections(next);

    if (!appendTransferItem(item)) {
      restoreTransferBookmark(next, bookmark, payload);
      normalizeSortOrders(next);
      persistDraft(next);
      setSections(next);
      toast.message("该书签已在中转站中");
      clearActiveDragPayload();
      return;
    }

    setStationReveal(true);
    toast.success("已加入中转站");
    clearActiveDragPayload();
  }

  function removeTransferItem(id: string) {
    const item = transferItemsRef.current.find((entry) => entry.id === id);
    if (!item) return;

    updateSections((prev) => {
      restoreTransferBookmark(prev, item.bookmark, item.from);
      return prev;
    });
    removeTransferItemFromState(id);
    toast.message("已移出中转站");
  }

  function clearAllTransferItems() {
    if (transferItemsRef.current.length === 0) return;
    restoreAllTransferItemsToSections();
    toast.message("已清空中转站");
  }

  function restoreAllTransferItemsToSections() {
    const items = transferItemsRef.current;
    if (items.length === 0) return;

    updateSections((prev) => {
      for (const item of items) {
        restoreTransferBookmark(prev, item.bookmark, item.from);
      }
      return prev;
    });
    replaceTransferItems([]);
  }

  /** 保存前把中转站书签还原到原分组，再写入项目 */
  function buildSectionsForSave() {
    const next = cloneSections(sectionsRef.current);
    for (const item of transferItemsRef.current) {
      restoreTransferBookmark(next, item.bookmark, item.from);
    }
    normalizeSortOrders(next);
    return next;
  }

  function enableStationDropPassthrough() {
    requestAnimationFrame(() => {
      stationPanelRef.current?.style.setProperty("pointer-events", "none");
    });
  }

  function disableStationDropPassthrough() {
    stationPanelRef.current?.style.removeProperty("pointer-events");
  }

  function handleStationDragStart(event: React.DragEvent<HTMLDivElement>, itemId: string) {
    const active = parseDragPayload(dragSessionPayloadRef.current ?? dragPayloadRef.current);
    if (active && isStationDragPayload(active) && active.itemId !== itemId) {
      event.preventDefault();
      return;
    }

    const item = findTransferItem(itemId);
    if (!item) {
      event.preventDefault();
      return;
    }

    dragOriginXRef.current = event.clientX;
    dragOriginYRef.current = event.clientY;
    const payload: StationDragPayload = { source: "station", itemId };
    dragSessionPayloadRef.current = payload;
    dragPayloadRef.current = payload;
    event.dataTransfer.effectAllowed = "move";
    writeDragPayloadData(event.dataTransfer, payload);
    // 延迟更新 UI，避免 dragStart 同步 re-render / pointer-events 变化取消拖拽
    requestAnimationFrame(() => {
      setDragPayload(payload);
      enableStationDropPassthrough();
    });
  }

  function handleStationDragEnd() {
    disableStationDropPassthrough();
    requestAnimationFrame(() => {
      // drop 先于 dragend；session 仍在表示未成功放入分组
      if (dragSessionPayloadRef.current && isStationDragPayload(dragSessionPayloadRef.current)) {
        clearActiveDragPayload();
      } else {
        clearDragUiState();
      }
    });
  }

  function handleTransferStationDragOver(event: React.DragEvent<HTMLDivElement>) {
    const payload = parseDragPayload(dragSessionPayloadRef.current);
    if (payload && isStationDragPayload(payload)) {
      event.dataTransfer.dropEffect = "none";
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    setTransferDropActive(true);
    setStationReveal(true);
  }

  function handleTransferStationDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setTransferDropActive(false);
    }
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
    targetSectionIndex: number,
    targetCardIndex: number,
  ) {
    event.preventDefault();
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);

    const payload = readDragPayload(event);
    if (!payload) return;

    if (isStationDragPayload(payload)) {
      const item = findTransferItem(payload.itemId);
      if (!item) {
        clearActiveDragPayload();
        return;
      }

      const grid = event.currentTarget;
      const insertIndex = resolveTransferInsertIndex(grid, event.clientX, event.clientY);

      removeTransferItemFromState(payload.itemId);

      const next = cloneSections(sectionsRef.current);
      const moved = insertTransferBookmark(next, item.bookmark, {
        sectionIndex: targetSectionIndex,
        cardIndex: targetCardIndex,
        bookmarkIndex: insertIndex,
      });

      if (!moved) {
        replaceTransferItems([...transferItemsRef.current, item]);
        clearActiveDragPayload();
        return;
      }

      normalizeSortOrders(next);
      persistDraft(next);
      setSections(next);
      toast.success("书签已添加");
      clearActiveDragPayload();
      return;
    }

    if (!isGridDragPayload(payload)) return;

    const gridPayload = payload;
    const grid = event.currentTarget;
    const dropElement = document.elementFromPoint(event.clientX, event.clientY);
    const droppedOnCard = dropElement?.closest("[data-bookmark-card]") as HTMLElement | null;
    if (droppedOnCard && grid.contains(droppedOnCard)) {
      const droppedIndex = Number(droppedOnCard.dataset.bookmarkIndex);
      if (
        gridPayload.sectionIndex === targetSectionIndex &&
        gridPayload.cardIndex === targetCardIndex &&
        gridPayload.bookmarkIndex === droppedIndex
      ) {
        clearActiveDragPayload();
        return;
      }
    }

    const swapTargetIndex = resolveDropCard(
      grid,
      event.clientX,
      event.clientY,
      gridPayload,
      targetSectionIndex,
      targetCardIndex,
    );

    updateSections((prev) => {
      const changed =
        swapTargetIndex != null
          ? swapBookmarks(prev, gridPayload, {
              sectionIndex: targetSectionIndex,
              cardIndex: targetCardIndex,
              bookmarkIndex: swapTargetIndex,
            })
          : insertBookmark(prev, gridPayload, {
              sectionIndex: targetSectionIndex,
              cardIndex: targetCardIndex,
              bookmarkIndex: getInsertIndex(
                grid,
                event.clientY,
                gridPayload,
                targetSectionIndex,
                targetCardIndex,
              ),
            });

      if (changed) toast.success("排序已更新");
      return prev;
    });
    clearActiveDragPayload();
  }

  return (
    <AdminDialogProvider>
    <TooltipProvider delayDuration={300}>
    <div className="bookmarks-app min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
      <BookmarkPageHeader
        title="书签管理后台"
        description={
          isDev
            ? "开发模式：保存会直接写入 db/data/bookmarks.ts"
            : "静态部署：请导出文件后手动替换并提交"
        }
        actions={(
          <AdminHeaderActions
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
        )}
      />

      <BookmarkStatsCards sections={stats.sections} cards={stats.cards} bookmarks={stats.bookmarks} />

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
                          const activePayload = parseDragPayload(dragPayloadRef.current ?? dragPayload);
                          if (!activePayload) return;

                          if (isStationDragPayload(activePayload)) {
                            setSwapHover(null);
                            const insertIndex = resolveTransferInsertIndex(
                              e.currentTarget,
                              e.clientX,
                              e.clientY,
                            );
                            setInsertHover({
                              sectionIndex: sIndex,
                              cardIndex: cIndex,
                              bookmarkIndex: insertIndex,
                            });
                            return;
                          }

                          setInsertHover(null);
                          const hoverIndex = resolveDropCard(
                            e.currentTarget,
                            e.clientX,
                            e.clientY,
                            activePayload,
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
                            const activePayload = parseDragPayload(dragPayloadRef.current ?? dragPayload);
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
                              isStationDragPayload(dragPayload) &&
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
                                          e.dataTransfer.effectAllowed = "move";
                                          writeDragPayloadData(e.dataTransfer, payload);
                                          requestAnimationFrame(() => {
                                            setDragPayload(payload);
                                          });
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
        isDev={isDev}
        summary={initialSummary}
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

      {dragEnabled ? (
        <DragTransferStation
          items={transferItems}
          side={stationSide}
          dragEnabled={dragEnabled}
          gripEnabled={dragEnabled}
          dropActive={transferDropActive}
          gridDragging={Boolean(dragEnabled && dragPayload && isGridDragPayload(dragPayload))}
          forceExpanded={forceStationExpanded}
          draggingItemId={draggingStationItemId}
          panelRef={stationPanelRef}
          onSideChange={handleStationSideChange}
          onDragOver={handleTransferStationDragOver}
          onDragLeave={handleTransferStationDragLeave}
          onDrop={handleTransferStationDrop}
          onRemoveItem={removeTransferItem}
          onClearAll={clearAllTransferItems}
          onItemDragStart={handleStationDragStart}
          onItemDragEnd={handleStationDragEnd}
        />
      ) : null}
      {dragEnabled &&
      Boolean(dragPayload && isGridDragPayload(dragPayload)) &&
      !forceStationExpanded &&
      dragApproachSide === "left" ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-0 z-10 hidden w-2 bg-linear-to-r from-[color-mix(in_oklab,var(--ring)_28%,transparent)] to-transparent md:block"
        />
      ) : null}
      {dragEnabled &&
      Boolean(dragPayload && isGridDragPayload(dragPayload)) &&
      !forceStationExpanded &&
      dragApproachSide === "right" ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 right-0 z-10 hidden w-2 bg-linear-to-l from-[color-mix(in_oklab,var(--ring)_28%,transparent)] to-transparent md:block"
        />
      ) : null}
      {dragEnabled &&
      Boolean(dragPayload && isGridDragPayload(dragPayload)) &&
      !forceStationExpanded &&
      dragApproachSide === "top" ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-10 hidden h-2 bg-linear-to-b from-[color-mix(in_oklab,var(--ring)_28%,transparent)] to-transparent md:block"
        />
      ) : null}
      {dragEnabled &&
      Boolean(dragPayload && isGridDragPayload(dragPayload)) &&
      !forceStationExpanded &&
      dragApproachSide === "bottom" ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-0 z-10 hidden h-2 bg-linear-to-t from-[color-mix(in_oklab,var(--ring)_28%,transparent)] to-transparent md:block"
        />
      ) : null}
    </div>
    </TooltipProvider>
    </AdminDialogProvider>
  );
}
