/**
 * 功能：管理端主编辑壳——组合草稿、中转站、网格拖拽、对话框与布局。
 * 关联：BookmarksAdminApp.tsx、useAdminTransferStation、useAdminGridDrag、useAdminEditorActions
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminHeaderActions } from "@/bookmarks/admin/components/chrome/AdminHeaderActions";
import { AdminBookmarkStatsCards } from "@/bookmarks/admin/components/stats/AdminBookmarkStatsCards";
import { BookmarkPageHeader } from "@/bookmarks/shared/components/BookmarkPageHeader";
import { countBookmarkStats } from "@/bookmarks/shared/lib/stats";
import { DragTransferStation } from "@/bookmarks/admin/components/transfer/DragTransferStation";
import { AdminDialogProvider } from "@/bookmarks/admin/components/dialogs/AdminDialogLayer";
import { SectionTabsNav } from "@/bookmarks/admin/components/sections/SectionTabsNav";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAdminSectionsDraft } from "@/bookmarks/admin/hooks/useAdminSectionsDraft";
import { clampSelectedSection } from "@/bookmarks/admin/lib/admin-helpers";
import { TRANSFER_STATION_MAX_ITEMS, type DragPayload } from "@/bookmarks/admin/lib/admin-helpers";
import { sectionMatchesSearch } from "@/bookmarks/shared/lib/search";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { useAdminDragEnabled } from "@/lib/use-admin-drag-enabled";
import { AdminAppDialogs } from "./AdminAppDialogs";
import { AdminAppSectionGrid } from "./AdminAppSectionGrid";
import { type AdminGridDragFns, useAdminGridDrag } from "./useAdminGridDrag";
import { useAdminEditorActions } from "./useAdminEditorActions";
import { useAdminTransferStation } from "./useAdminTransferStation";

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

  const dragSessionPayloadRef = useRef<DragPayload | null>(null);
  const dragPayloadRef = useRef<DragPayload | null>(null);
  const stationPanelRef = useRef<HTMLElement | null>(null);
  const modulePanelRef = useRef<HTMLDivElement | null>(null);
  const gridDragFnsRef = useRef<AdminGridDragFns>({} as AdminGridDragFns);
  const gridDragRef = useRef<ReturnType<typeof useAdminGridDrag> | null>(null);

  const dragEnabled = useAdminDragEnabled();

  const transferStation = useAdminTransferStation({
    dragSessionPayloadRef,
    dragPayloadRef,
    stationPanelRef,
    modulePanelRef,
    dragEnabled,
    dragPayload: gridDragRef.current?.dragPayload ?? null,
    dragApproaching: gridDragRef.current?.dragApproaching ?? false,
    sectionsRef,
    setSections,
    persistDraft,
    updateSections,
    gridDragFnsRef,
  });

  const gridDrag = useAdminGridDrag({
    dragSessionPayloadRef,
    dragPayloadRef,
    dragEnabled,
    sectionsRef,
    setSections,
    updateSections,
    persistDraft,
    modulePanelRef,
    stationPanelRef,
    transferStation,
    gridDragFnsRef,
  });

  gridDragRef.current = gridDrag;

  const editorActions = useAdminEditorActions({
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
    buildSectionsForSave: transferStation.buildSectionsForSave,
    restoreAllTransferItemsToSections: transferStation.restoreAllTransferItemsToSections,
    replaceTransferItems: transferStation.replaceTransferItems,
    transferItemsRef: transferStation.transferItemsRef,
  });

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
    gridDrag.setDropTarget(null);
    gridDrag.setSwapHover(null);
    gridDrag.setInsertHover(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset hover when section tab changes
  }, [sectionIndex]);

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
              actions={
                <AdminHeaderActions
                  isDev={isDev}
                  userName={userName}
                  onImportJson={editorActions.importJson}
                  onExportJson={editorActions.exportJson}
                  onOpenVersionHistory={() => editorActions.setVersionDialogOpen(true)}
                  onRestoreInitial={() => editorActions.setRestoreDialogOpen(true)}
                  onSave={editorActions.openSaveDialog}
                  onReturnToFrontend={editorActions.handleReturnToFrontend}
                  onReturnToBlog={editorActions.handleReturnToBlog}
                  onLogout={editorActions.handleLogout}
                />
              }
            />

            <AdminBookmarkStatsCards
              sections={stats.sections}
              cards={stats.cards}
              bookmarks={stats.bookmarks}
              transferStationCount={transferStation.transferItems.length}
              transferStationMax={TRANSFER_STATION_MAX_ITEMS}
            />

            {sections.length === 0 ? (
              <>
                <SectionTabsNav
                  sections={sections}
                  selectedIndex={0}
                  onSelect={() => {}}
                  onOpenSectionManage={() => editorActions.setSectionManageOpen(true)}
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
                  onOpenSectionManage={() => editorActions.setSectionManageOpen(true)}
                  jumpSelect
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                />

                <AdminAppSectionGrid
                  sections={sections}
                  sectionsRef={sectionsRef}
                  normalizedSearch={normalizedSearch}
                  dragEnabled={dragEnabled}
                  gridDrag={gridDrag}
                  editorActions={editorActions}
                />
              </Tabs>
            )}

            <AdminAppDialogs
              isDev={isDev}
              sections={sections}
              sectionIndex={sectionIndex}
              initialSummary={initialSummary}
              editorActions={editorActions}
              setSelectedSection={setSelectedSection}
            />
          </div>

          {dragEnabled && (transferStation.stationVisible || gridDrag.dragApproaching) ? (
            <DragTransferStation
              items={transferStation.transferItems}
              dock={transferStation.dock}
              dragEnabled={dragEnabled}
              gripEnabled={dragEnabled}
              dropActive={transferStation.transferDropActive}
              gridDragging={gridDrag.gridDragging}
              dragApproaching={gridDrag.dragApproaching}
              forceExpanded={transferStation.forceStationExpanded}
              panelExpanded={transferStation.stationPanelExpanded}
              onPanelExpandedChange={transferStation.handleStationPanelExpandedChange}
              entering={transferStation.stationEntering}
              dismissing={transferStation.stationDismissing}
              sideFlipping={transferStation.stationSideFlipping}
              draggingItemId={transferStation.draggingStationItemId}
              panelRef={stationPanelRef}
              onDockChange={transferStation.handleDockChange}
              onDockCommit={transferStation.handleDockCommit}
              onDragEnter={transferStation.handleTransferStationDragEnter}
              onDragOver={transferStation.handleTransferStationDragOver}
              onDragLeave={transferStation.handleTransferStationDragLeave}
              onDrop={transferStation.handleTransferStationDrop}
              onRemoveItem={transferStation.removeTransferItem}
              onClearAll={transferStation.clearAllTransferItems}
              onItemDragStart={transferStation.handleStationDragStart}
              onItemDragEnd={transferStation.handleStationDragEnd}
              onUserActivity={transferStation.bumpStationActivity}
            />
          ) : null}
        </div>
      </TooltipProvider>
    </AdminDialogProvider>
  );
}
