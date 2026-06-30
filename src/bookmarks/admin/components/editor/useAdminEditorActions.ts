/**
 * 功能：管理端编辑/保存/离开/删除/导入导出/版本历史操作与对话框状态。
 * 关联：AdminApp.tsx、AdminAppDialogs.tsx、useAdminTransferStation.ts
 */
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { DeleteTarget } from "@/bookmarks/admin/components/dialogs/DeleteConfirmDialog";
import { applyEditFormToSections } from "@/bookmarks/admin/lib/admin-bookmark-edit";
import { saveSectionsToProject } from "@/bookmarks/admin/lib/admin-api";
import { getAuthorizationHeader } from "@/bookmarks/admin/lib/admin-auth";
import {
  cardCanDelete,
  cloneSections,
  countBookmarks,
  clearTransferStationStorage,
  normalizeSortOrders,
  sectionCanDelete,
  STORAGE_KEY,
  type EditContext,
} from "@/bookmarks/admin/lib/admin-helpers";
import { downloadTextFile, serializeBookmarkSections } from "@/bookmarks/shared/data/serialize";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";

interface UseAdminEditorActionsParams {
  isDev: boolean;
  onLogout: () => void;
  initialSections: BookmarkSectionData[];
  sections: BookmarkSectionData[];
  setSections: React.Dispatch<React.SetStateAction<BookmarkSectionData[]>>;
  updateSections: (updater: (prev: BookmarkSectionData[]) => BookmarkSectionData[]) => void;
  persistDraft: (sections: BookmarkSectionData[]) => void;
  markSectionsSaved: (sections: BookmarkSectionData[]) => void;
  hasUnsavedChanges: boolean;
  saveSummary: ReturnType<typeof import("@/bookmarks/admin/hooks/useAdminSectionsDraft").useAdminSectionsDraft>["saveSummary"];
  setSelectedSection: React.Dispatch<React.SetStateAction<number>>;
  buildSectionsForSave: () => BookmarkSectionData[];
  restoreAllTransferItemsToSections: () => void;
  replaceTransferItems: (items: import("@/bookmarks/admin/lib/admin-helpers").TransferStationItem[]) => void;
  transferItemsRef: React.MutableRefObject<import("@/bookmarks/admin/lib/admin-helpers").TransferStationItem[]>;
}

export function useAdminEditorActions({
  isDev,
  onLogout,
  initialSections,
  sections,
  setSections,
  updateSections,
  persistDraft,
  markSectionsSaved,
  hasUnsavedChanges,
  saveSummary,
  setSelectedSection,
  buildSectionsForSave,
  restoreAllTransferItemsToSections,
  replaceTransferItems,
  transferItemsRef,
}: UseAdminEditorActionsParams) {
  const [editContext, setEditContext] = useState<EditContext | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const pendingLeaveRef = useRef<(() => void) | null>(null);
  const [leaveAfterSave, setLeaveAfterSave] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [sectionManageOpen, setSectionManageOpen] = useState(false);

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
            : "已写入 db/data/bookmarks.ts，刷新页面即可看到更新",
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

  return {
    editContext,
    saveDialogOpen,
    leaveDialogOpen,
    leaveAfterSave,
    restoreDialogOpen,
    versionDialogOpen,
    saving,
    deleteTarget,
    sectionManageOpen,
    setSectionManageOpen,
    setRestoreDialogOpen,
    setVersionDialogOpen,
    setDeleteTarget,
    openEdit,
    closeEdit,
    handleEditSubmit,
    openSaveDialog,
    closeSaveDialog,
    confirmSaveToProject,
    closeLeaveDialog,
    confirmSaveAndLeave,
    confirmLeaveWithoutSave,
    handleReturnToFrontend,
    handleReturnToBlog,
    handleLogout,
    applyVersion,
    confirmDelete,
    openAddSection,
    requestDeleteSection,
    requestDeleteCard,
    confirmRestore,
    exportJson,
    importJson,
    saveSummary,
  };
}
