/** 管理端主编辑界面：CRUD、拖拽、对话框、脏检测 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AdminHeaderActions } from "@/bookmarks/admin/components/chrome/AdminHeaderActions";
import { AdminBookmarkStatsCards } from "@/bookmarks/admin/components/stats/AdminBookmarkStatsCards";
import { BookmarkPageHeader } from "@/bookmarks/shared/components/BookmarkPageHeader";
import { countBookmarkStats } from "@/bookmarks/shared/lib/stats";
import { BookmarkAddTile } from "@/bookmarks/admin/components/grid/BookmarkAddTile";
import { BookmarkCard } from "@/bookmarks/admin/components/grid/BookmarkCard";
import { BookmarkCardGroup } from "@/bookmarks/admin/components/grid/BookmarkCardGroup";
import { DragTransferStation } from "@/bookmarks/admin/components/transfer/DragTransferStation";
import { BookmarkSectionPanel } from "@/bookmarks/admin/components/grid/BookmarkSectionPanel";
import {
  adminDragSwapTargetHoverClass,
  adminDropZoneHoverClass,
} from "@/bookmarks/admin/components/chrome/ui-helpers";
import { DeleteConfirmDialog, type DeleteTarget } from "@/bookmarks/admin/components/dialogs/DeleteConfirmDialog";
import { AdminDialogProvider } from "@/bookmarks/admin/components/dialogs/AdminDialogLayer";
import { EditDialog } from "@/bookmarks/admin/components/dialogs/EditDialog";
import { LeaveUnsavedDialog } from "@/bookmarks/admin/components/dialogs/LeaveUnsavedDialog";
import { RestoreConfirmDialog } from "@/bookmarks/admin/components/dialogs/RestoreConfirmDialog";
import { SectionManageDialog } from "@/bookmarks/admin/components/dialogs/SectionManageDialog";
import { SectionTabsNav } from "@/bookmarks/admin/components/sections/SectionTabsNav";
import { SaveConfirmDialog } from "@/bookmarks/admin/components/dialogs/SaveConfirmDialog";
import { VersionHistoryDialog } from "@/bookmarks/admin/components/dialogs/VersionHistoryDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAdminSectionsDraft } from "@/bookmarks/admin/hooks/useAdminSectionsDraft";
import { applyEditFormToSections } from "@/bookmarks/admin/lib/admin-bookmark-edit";
import {
  type BookmarkDragTarget,
  getBookmarkInsertIndex,
  resolveDropBookmarkIndex,
} from "@/bookmarks/admin/lib/admin-grid-dnd";
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
  isNoOpGridInsert,
  isStationDragPayload,
  loadTransferStationItems,
  loadTransferStationDock,
  normalizeSortOrders,
  parseDragPayload,
  persistTransferStationDock,
  persistTransferStationItems,
  clearTransferStationStorage,
  computeDragPointerToCardCenterOffset,
  followTransferStationDockToCard,
  isSameTransferStationDock,
  readDragPayloadData,
  restoreTransferBookmark,
  resolveTransferInsertIndex,
  resolveTransferStationEdgeFlipSide,
  resolveTransferStationSideFromPanel,
  TRANSFER_STATION_MAX_ITEMS,
  sectionCanDelete,
  STORAGE_KEY,
  swapBookmarks,
  takeBookmarkForTransfer,
  transferStationHasBookmark,
  transferStationIsFull,
  type StationDragPayload,
  type TransferStationDockState,
  type TransferStationItem,
  type TransferStationSide,
  writeDragPayloadData,
} from "@/bookmarks/admin/lib/admin-helpers";
import { downloadTextFile, serializeBookmarkSections } from "@/bookmarks/shared/data/serialize";
import { getVisibleCardsInSection, sectionMatchesSearch } from "@/bookmarks/shared/lib/search";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { migrateAllLegacyStorageKeys } from "@/lib/site-storage";
import { cn } from "@/lib/utils";
import { useAdminDragEnabled } from "@/lib/use-admin-drag-enabled";

const STATION_IDLE_HIDE_MS = 5_000;
const STATION_DISMISS_MS = 240;

interface AdminAppProps {
  initialSections: BookmarkSectionData[];
  isDev: boolean;
  userName: string;
  onLogout: () => void;
}

export function AdminApp({
  initialSections,
  isDev,
  userName,
  onLogout,
}: AdminAppProps) {
  const {
    sections,
    setSections,
    sectionsRef,
    hasUnsavedChanges,
    updateSections,
    persistDraft,
    saveSummary,
    initialSummary,
    markSectionsSaved,
  } = useAdminSectionsDraft(initialSections);
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
  const [dock, setDock] = useState<TransferStationDockState>(() => loadTransferStationDock());
  const [stationVisible, setStationVisible] = useState(() => loadTransferStationItems().length > 0);
  const [stationDismissing, setStationDismissing] = useState(false);
  const [stationSideFlipping, setStationSideFlipping] = useState(false);
  const [stationEntering, setStationEntering] = useState(false);
  const [stationPanelExpanded, setStationPanelExpanded] = useState(
    () => loadTransferStationItems().length > 0,
  );
  const [stationIdleEpoch, setStationIdleEpoch] = useState(0);
  const stationDismissTimerRef = useRef<number | null>(null);
  const stationSideFlipTimerRef = useRef<number | null>(null);
  const stationSideFlippingRef = useRef(false);
  const stationVisibleRef = useRef(stationVisible);
  const stationDismissingRef = useRef(stationDismissing);
  const [dragApproachSide, setDragApproachSide] = useState<TransferStationSide | null>(null);
  const dragPayloadRef = useRef<DragPayload | null>(null);
  const dragSessionPayloadRef = useRef<DragPayload | null>(null);
  const dragOriginXRef = useRef<number | null>(null);
  const dragOriginYRef = useRef<number | null>(null);
  const dragCardPointerToCenterYRef = useRef<number | null>(null);
  const stationPanelRef = useRef<HTMLElement | null>(null);
  const modulePanelRef = useRef<HTMLDivElement | null>(null);
  const transferItemsRef = useRef(transferItems);
  const dockRef = useRef(dock);
  const transferDropDepthRef = useRef(0);
  const transferFullToastShownRef = useRef(false);
  const pendingDragPayloadFrameRef = useRef<number | null>(null);
  const dragEnabled = useAdminDragEnabled();

  transferItemsRef.current = transferItems;
  dockRef.current = dock;
  stationVisibleRef.current = stationVisible;
  stationDismissingRef.current = stationDismissing;

  const bumpStationActivity = useCallback(() => {
    setStationIdleEpoch((epoch) => epoch + 1);
  }, []);

  function setDockPosition(next: TransferStationDockState) {
    if (isSameTransferStationDock(next, dockRef.current)) return;
    dockRef.current = next;
    setDock(next);
  }

  function commitDockPosition(next?: TransferStationDockState) {
    if (next && !isSameTransferStationDock(next, dockRef.current)) {
      dockRef.current = next;
      setDock(next);
    }
    persistTransferStationDock(dockRef.current);
  }

  function handleDockChange(next: TransferStationDockState) {
    bumpStationActivity();
    setDockPosition(next);
  }

  function handleDockCommit() {
    commitDockPosition();
  }

  function flipTransferStationToSide(nextSide: TransferStationSide) {
    if (dockRef.current.side === nextSide) return;
    if (stationSideFlippingRef.current) return;

    cancelStationDismiss();
    setStationEntering(false);
    if (!stationVisibleRef.current) {
      setStationVisible(true);
    }

    stationSideFlippingRef.current = true;
    setStationSideFlipping(true);

    stationSideFlipTimerRef.current = window.setTimeout(() => {
      stationSideFlipTimerRef.current = null;
      commitDockPosition({ ...dockRef.current, side: nextSide });
      setStationSideFlipping(false);
      setStationEntering(true);
      stationSideFlippingRef.current = false;
    }, STATION_DISMISS_MS);
  }

  function replaceTransferItems(next: TransferStationItem[]) {
    persistTransferStationItems(next);
    setTransferItems(next);
  }

  function prependTransferItem(item: TransferStationItem) {
    if (transferStationHasBookmark(transferItemsRef.current, item.bookmark.url)) {
      return false;
    }
    if (transferStationIsFull(transferItemsRef.current)) {
      return false;
    }
    replaceTransferItems([item, ...transferItemsRef.current]);
    return true;
  }

  function removeTransferItemFromState(id: string) {
    replaceTransferItems(transferItemsRef.current.filter((entry) => entry.id !== id));
  }

  function findTransferItem(id: string) {
    return transferItemsRef.current.find((entry) => entry.id === id) ?? null;
  }

  function cancelStationSideFlip() {
    if (stationSideFlipTimerRef.current != null) {
      window.clearTimeout(stationSideFlipTimerRef.current);
      stationSideFlipTimerRef.current = null;
    }
    stationSideFlippingRef.current = false;
    setStationSideFlipping(false);
    setStationEntering(false);
  }

  function cancelStationDismiss() {
    if (stationDismissTimerRef.current != null) {
      window.clearTimeout(stationDismissTimerRef.current);
      stationDismissTimerRef.current = null;
    }
    setStationDismissing(false);
  }

  function wakeStationForApproach() {
    cancelStationDismiss();
    setStationEntering(false);
    setStationVisible(true);
  }

  function showStation() {
    cancelStationDismiss();
    if (!stationVisible) {
      setStationEntering(true);
    }
    setStationVisible(true);
  }

  function beginStationMinimize() {
    if (!stationPanelExpanded) return;
    setStationPanelExpanded(false);
  }

  function beginStationDismiss() {
    if (!stationVisible || stationDismissing) return;
    setStationDismissing(true);
    stationDismissTimerRef.current = window.setTimeout(() => {
      stationDismissTimerRef.current = null;
      setStationVisible(false);
      setStationPanelExpanded(false);
      setStationDismissing(false);
    }, STATION_DISMISS_MS);
  }

  function handleStationPanelExpandedChange(expanded: boolean) {
    setStationPanelExpanded(expanded);
    bumpStationActivity();
    if (expanded) showStation();
  }

  function syncDragCardCenterOffset(event: React.DragEvent<HTMLElement>) {
    const card =
      event.currentTarget.closest<HTMLElement>("[data-bookmark-card]") ?? event.currentTarget;
    const rect = card.getBoundingClientRect();
    dragCardPointerToCenterYRef.current = computeDragPointerToCardCenterOffset(
      event.clientY,
      rect,
    );
  }

  function applyDragApproach(
    side: TransferStationSide,
    clientY: number,
  ) {
    setDragApproachSide(side);
    wakeStationForApproach();
    setDockPosition(
      followTransferStationDockToCard(
        dockRef.current,
        side,
        clientY,
        dragCardPointerToCenterYRef.current,
        window.innerHeight,
        { snap: false },
      ),
    );
  }

  const applyDragApproachRef = useRef(applyDragApproach);
  const beginStationDismissRef = useRef(beginStationDismiss);
  applyDragApproachRef.current = applyDragApproach;
  beginStationDismissRef.current = beginStationDismiss;

  function maybeToastTransferStationFull() {
    if (!transferStationIsFull(transferItemsRef.current)) return;
    if (transferFullToastShownRef.current) return;
    transferFullToastShownRef.current = true;
    toast.message(`中转站最多 ${TRANSFER_STATION_MAX_ITEMS} 个书签`);
  }

  const gridDragPayload =
    parseDragPayload(dragSessionPayloadRef.current) ??
    (dragPayload && isGridDragPayload(dragPayload) ? dragPayload : null);
  const gridDragging = Boolean(dragEnabled && gridDragPayload && isGridDragPayload(gridDragPayload));
  const dragApproaching = Boolean(gridDragging && dragApproachSide != null);
  const forceStationExpanded = transferDropActive || dragApproaching;
  const draggingStationItemId =
    dragPayload && isStationDragPayload(dragPayload) ? dragPayload.itemId : null;

  function cancelPendingDragPayloadFrame() {
    if (pendingDragPayloadFrameRef.current == null) return;
    cancelAnimationFrame(pendingDragPayloadFrameRef.current);
    pendingDragPayloadFrameRef.current = null;
  }

  function scheduleDragPayloadSync(payload: DragPayload) {
    cancelPendingDragPayloadFrame();
    pendingDragPayloadFrameRef.current = requestAnimationFrame(() => {
      pendingDragPayloadFrameRef.current = null;
      if (dragSessionPayloadRef.current !== payload) return;
      setDragPayload(payload);
    });
  }

  function setActiveDragPayload(payload: DragPayload | null) {
    dragSessionPayloadRef.current = payload;
    dragPayloadRef.current = payload;
    setDragPayload(payload);
  }

  function clearActiveDragPayload() {
    cancelPendingDragPayloadFrame();
    disableStationDropPassthrough();
    dragSessionPayloadRef.current = null;
    dragPayloadRef.current = null;
    dragOriginXRef.current = null;
    dragOriginYRef.current = null;
    dragCardPointerToCenterYRef.current = null;
    setDragPayload(null);
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);
    setTransferDropActive(false);
    setDragApproachSide(null);
    transferDropDepthRef.current = 0;
    transferFullToastShownRef.current = false;
    commitDockPosition();
  }

  function clearDragUiState() {
    cancelPendingDragPayloadFrame();
    dragSessionPayloadRef.current = null;
    dragPayloadRef.current = null;
    dragCardPointerToCenterYRef.current = null;
    setDragPayload(null);
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);
    setTransferDropActive(false);
    setDragApproachSide(null);
    transferDropDepthRef.current = 0;
    transferFullToastShownRef.current = false;
  }

  function scheduleClearActiveDragPayload() {
    cancelPendingDragPayloadFrame();
    requestAnimationFrame(() => {
      clearActiveDragPayload();
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
    if (transferDropActive || draggingStationItemId || dragApproaching) {
      wakeStationForApproach();
      return;
    }

    if (stationDismissing) return;

    const hasItems = transferItems.length > 0;

    if (hasItems) {
      if (!stationVisible) {
        showStation();
      }
      if (!stationPanelExpanded) return;

      const timer = window.setTimeout(() => beginStationMinimize(), STATION_IDLE_HIDE_MS);
      return () => window.clearTimeout(timer);
    }

    if (!stationVisible) return;

    const timer = window.setTimeout(() => beginStationDismiss(), STATION_IDLE_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [
    transferItems.length,
    transferDropActive,
    draggingStationItemId,
    dragApproaching,
    stationVisible,
    stationDismissing,
    stationPanelExpanded,
    stationIdleEpoch,
  ]);

  useEffect(() => {
    if (!stationEntering) return;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setStationEntering(false));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [stationEntering]);

  useEffect(() => {
    return () => {
      cancelStationDismiss();
      cancelStationSideFlip();
    };
  }, []);

  useEffect(() => {
    if (!dragEnabled) return;

    function onDoubleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("input, textarea, select, button, a, [contenteditable='true']")) return;

      const nextSide = resolveTransferStationEdgeFlipSide(
        dockRef.current.side,
        event.clientX,
        window.innerWidth,
      );
      if (!nextSide) return;

      event.preventDefault();
      flipTransferStationToSide(nextSide);
    }

    document.addEventListener("dblclick", onDoubleClick, true);
    return () => {
      document.removeEventListener("dblclick", onDoubleClick, true);
    };
  }, [dragEnabled]);

  useEffect(() => {
    if (!dragEnabled) return;

    function onDragOver(event: DragEvent) {
      const payload = parseDragPayload(dragSessionPayloadRef.current);
      if (!payload || !isGridDragPayload(payload)) return;

      event.preventDefault();

      const target = event.target;
      if (target instanceof Node && stationPanelRef.current?.contains(target)) return;

      const panel = modulePanelRef.current?.getBoundingClientRect();
      if (!panel) return;

      const resolvedSide = resolveTransferStationSideFromPanel(event.clientX, panel);
      if (resolvedSide) {
        applyDragApproachRef.current(resolvedSide, event.clientY);
        return;
      }

      setDragApproachSide((prev) => {
        if (prev == null) return null;
        if (
          transferItemsRef.current.length === 0 &&
          stationVisibleRef.current &&
          !stationDismissingRef.current
        ) {
          beginStationDismissRef.current();
        }
        return null;
      });
    }

    document.addEventListener("dragover", onDragOver, true);
    return () => {
      document.removeEventListener("dragover", onDragOver, true);
    };
  }, [dragEnabled]);

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
    if (hadTransferDraft) toast.message("已恢复中转站暂存");
  }, [hadTransferDraft]);

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

  useEffect(() => {
    setDropTarget(null);
    setSwapHover(null);
    setInsertHover(null);
  }, [sectionIndex]);

  function openEdit(context: EditContext) {
    setEditContext(context);
  }

  function closeEdit() {
    setEditContext(null);
  }

  function handleEditSubmit(data: Record<string, string>) {
    if (!editContext) return;
    if (!applyEditFormToSections(editContext, data, updateSections, setSelectedSection)) return;
    closeEdit();
    toast.success("已保存到本地草稿");
  }

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
      markSectionsSaved(sectionsToSave);
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
    transferDropDepthRef.current = 0;
    setTransferDropActive(false);

    try {
      const payload = readDragPayload(event);
      if (!payload || !isGridDragPayload(payload)) return;

      const sourceBookmark =
        sectionsRef.current[payload.sectionIndex]?.cards[payload.cardIndex]?.bookmarks[
          payload.bookmarkIndex
        ];
      if (!sourceBookmark) return;

      if (transferStationIsFull(transferItemsRef.current)) {
        toast.message(`中转站最多 ${TRANSFER_STATION_MAX_ITEMS} 个书签`);
        return;
      }

      if (transferStationHasBookmark(transferItemsRef.current, sourceBookmark.url)) {
        toast.message("该书签已在中转站中");
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

      if (!prependTransferItem(item)) {
        restoreTransferBookmark(next, bookmark, payload);
        normalizeSortOrders(next);
        persistDraft(next);
        setSections(next);
        toast.message(
          transferStationIsFull(transferItemsRef.current)
            ? `中转站最多 ${TRANSFER_STATION_MAX_ITEMS} 个书签`
            : "该书签已在中转站中",
        );
        return;
      }

      showStation();
      setStationPanelExpanded(true);
      toast.success("已加入中转站");
    } finally {
      clearActiveDragPayload();
    }
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
    cancelStationDismiss();
    setStationVisible(true);
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
    syncDragCardCenterOffset(event);
    const payload: StationDragPayload = { source: "station", itemId };
    dragSessionPayloadRef.current = payload;
    dragPayloadRef.current = payload;
    event.dataTransfer.effectAllowed = "move";
    writeDragPayloadData(event.dataTransfer, payload);
    scheduleDragPayloadSync(payload);
    requestAnimationFrame(() => {
      enableStationDropPassthrough();
    });
  }

  function handleStationDragEnd() {
    disableStationDropPassthrough();
    cancelPendingDragPayloadFrame();
    requestAnimationFrame(() => {
      // drop 先于 dragend；session 仍在表示未成功放入分组
      if (dragSessionPayloadRef.current && isStationDragPayload(dragSessionPayloadRef.current)) {
        clearActiveDragPayload();
      } else {
        clearDragUiState();
      }
    });
  }

  function handleTransferStationDragEnter(event: React.DragEvent<HTMLDivElement>) {
    const payload = parseDragPayload(dragSessionPayloadRef.current);
    if (payload && isStationDragPayload(payload)) return;

    event.preventDefault();
    event.stopPropagation();
    transferDropDepthRef.current += 1;
    setTransferDropActive(true);
    bumpStationActivity();
    showStation();
  }

  function handleTransferStationDragOver(event: React.DragEvent<HTMLDivElement>) {
    const payload = parseDragPayload(dragSessionPayloadRef.current);
    if (payload && isStationDragPayload(payload)) {
      event.dataTransfer.dropEffect = "none";
      return;
    }

    if (transferStationIsFull(transferItemsRef.current)) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "none";
      maybeToastTransferStationFull();
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    if (transferDropDepthRef.current === 0) {
      transferDropDepthRef.current = 1;
    }
    setTransferDropActive(true);
    bumpStationActivity();
    showStation();
  }

  function handleTransferStationDragLeave(event: React.DragEvent<HTMLDivElement>) {
    const related = event.relatedTarget;
    if (related instanceof Node && event.currentTarget.contains(related)) return;

    event.stopPropagation();
    transferDropDepthRef.current = Math.max(0, transferDropDepthRef.current - 1);
    if (transferDropDepthRef.current === 0) {
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

    const shiftInsert = event.shiftKey;
    const swapTargetIndex = shiftInsert
      ? null
      : resolveDropBookmarkIndex(
          grid,
          event.clientX,
          event.clientY,
          gridPayload,
          targetSectionIndex,
          targetCardIndex,
        );

    updateSections((prev) => {
      const insertIndex = shiftInsert
        ? resolveTransferInsertIndex(grid, event.clientX, event.clientY)
        : getBookmarkInsertIndex(
            grid,
            event.clientY,
            gridPayload,
            targetSectionIndex,
            targetCardIndex,
          );
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
              bookmarkIndex: insertIndex,
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
      <div ref={modulePanelRef} className="mx-auto max-w-6xl space-y-4">
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

      <AdminBookmarkStatsCards
        sections={stats.sections}
        cards={stats.cards}
        bookmarks={stats.bookmarks}
        transferStationCount={transferItems.length}
        transferStationMax={TRANSFER_STATION_MAX_ITEMS}
      />

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
                                    sectionsRef.current[sIndex]?.cards[cIndex]?.bookmarks
                                      .length ?? 0;
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

      {dragEnabled && (stationVisible || dragApproaching) ? (
        <DragTransferStation
          items={transferItems}
          dock={dock}
          dragEnabled={dragEnabled}
          gripEnabled={dragEnabled}
          dropActive={transferDropActive}
          gridDragging={gridDragging}
          dragApproaching={dragApproaching}
          forceExpanded={forceStationExpanded}
          panelExpanded={stationPanelExpanded}
          onPanelExpandedChange={handleStationPanelExpandedChange}
          entering={stationEntering}
          dismissing={stationDismissing}
          sideFlipping={stationSideFlipping}
          draggingItemId={draggingStationItemId}
          panelRef={stationPanelRef}
          onDockChange={handleDockChange}
          onDockCommit={handleDockCommit}
          onDragEnter={handleTransferStationDragEnter}
          onDragOver={handleTransferStationDragOver}
          onDragLeave={handleTransferStationDragLeave}
          onDrop={handleTransferStationDrop}
          onRemoveItem={removeTransferItem}
          onClearAll={clearAllTransferItems}
          onItemDragStart={handleStationDragStart}
          onItemDragEnd={handleStationDragEnd}
          onUserActivity={bumpStationActivity}
        />
      ) : null}
    </div>
    </TooltipProvider>
    </AdminDialogProvider>
  );
}
