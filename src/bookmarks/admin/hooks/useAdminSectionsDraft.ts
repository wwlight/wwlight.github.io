import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  cloneSections,
  countBookmarks,
  normalizeSortOrders,
  sectionsEqual,
  STORAGE_KEY,
} from "@/bookmarks/admin/lib/admin-helpers";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { migrateAllLegacyStorageKeys } from "@/lib/site-storage";

export function useAdminSectionsDraft(initialSections: BookmarkSectionData[]) {
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
  const sectionsRef = useRef(sections);

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useEffect(() => {
    if (hadDraft) toast.message("已恢复本地草稿");
  }, [hadDraft]);

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

  function markSectionsSaved(next: BookmarkSectionData[]) {
    const saved = cloneSections(next);
    setSections(saved);
    setSavedBaseline(saved);
  }

  return {
    sections,
    setSections,
    sectionsRef,
    savedBaseline,
    setSavedBaseline,
    hasUnsavedChanges,
    updateSections,
    persistDraft,
    saveSummary,
    initialSummary,
    markSectionsSaved,
  };
}
