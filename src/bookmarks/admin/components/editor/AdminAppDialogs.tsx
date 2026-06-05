/**
 * 功能：管理端编辑界面全部对话框集群。
 * 关联：AdminApp.tsx、useAdminEditorActions.ts
 */
import { DeleteConfirmDialog } from "@/bookmarks/admin/components/dialogs/DeleteConfirmDialog";
import { EditDialog } from "@/bookmarks/admin/components/dialogs/EditDialog";
import { LeaveUnsavedDialog } from "@/bookmarks/admin/components/dialogs/LeaveUnsavedDialog";
import { RestoreConfirmDialog } from "@/bookmarks/admin/components/dialogs/RestoreConfirmDialog";
import { SectionManageDialog } from "@/bookmarks/admin/components/dialogs/SectionManageDialog";
import { SaveConfirmDialog } from "@/bookmarks/admin/components/dialogs/SaveConfirmDialog";
import { VersionHistoryDialog } from "@/bookmarks/admin/components/dialogs/VersionHistoryDialog";
import { getAuthorizationHeader } from "@/bookmarks/admin/lib/admin-auth";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import type { useAdminEditorActions } from "./useAdminEditorActions";

interface AdminAppDialogsProps {
  isDev: boolean;
  sections: BookmarkSectionData[];
  sectionIndex: number;
  initialSummary: ReturnType<typeof import("@/bookmarks/admin/hooks/useAdminSectionsDraft").useAdminSectionsDraft>["initialSummary"];
  editorActions: ReturnType<typeof useAdminEditorActions>;
  setSelectedSection: React.Dispatch<React.SetStateAction<number>>;
}

export function AdminAppDialogs({
  isDev,
  sections,
  sectionIndex,
  initialSummary,
  editorActions,
  setSelectedSection,
}: AdminAppDialogsProps) {
  const {
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
    closeEdit,
    handleEditSubmit,
    closeSaveDialog,
    confirmSaveToProject,
    closeLeaveDialog,
    confirmSaveAndLeave,
    confirmLeaveWithoutSave,
    applyVersion,
    confirmDelete,
    openAddSection,
    openEdit,
    requestDeleteSection,
    requestDeleteCard,
    confirmRestore,
    saveSummary,
  } = editorActions;

  return (
    <>
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
    </>
  );
}
