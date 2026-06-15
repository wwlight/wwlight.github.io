/**
 * 功能：编辑弹窗壳——表单状态、校验、书签/模块/分组分支。
 * 关联：BookmarkEditFields.tsx、useBookmarkUrlMetadata.ts
 */
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { BookmarkEditFields } from "@/bookmarks/admin/components/dialogs/BookmarkEditFields";
import { useAdminDialogLayer } from "@/bookmarks/admin/components/dialogs/AdminDialogLayer";
import { ShakeInputField } from "@/bookmarks/admin/components/dialogs/ShakeInputField";
import { useBookmarkUrlMetadata } from "@/bookmarks/admin/hooks/useBookmarkUrlMetadata";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import {
  BOOKMARK_DESCRIPTION_MAX_LENGTH,
  type EditContext,
} from "@/bookmarks/admin/lib/admin-helpers";
import { titleFallbackForSubmit } from "@/bookmarks/shared/lib/bookmark-url-metadata";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { cn } from "@/lib/utils";

interface EditFieldErrors {
  title?: boolean;
  url?: boolean;
}

interface EditDialogProps {
  open: boolean;
  context: EditContext | null;
  sections: BookmarkSectionData[];
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
}

function getTitle(context: EditContext | null, sections: BookmarkSectionData[]) {
  if (!context) return "编辑";
  if (context.type === "section") {
    return context.sectionIndex < sections.length ? "编辑模块" : "新增模块";
  }
  if (context.type === "card") {
    return context.cardIndex != null ? "编辑分组" : "新增分组";
  }
  return context.bookmarkIndex != null ? "编辑书签" : "新增书签";
}

function getInitialValues(
  context: EditContext | null,
  sections: BookmarkSectionData[],
): Record<string, string> {
  if (!context) return {};

  const section = sections[context.sectionIndex];
  if (context.type === "section") {
    return { title: section?.title ?? "" };
  }
  if (context.type === "card") {
    const card = context.cardIndex != null ? section?.cards[context.cardIndex] : undefined;
    return { title: card?.title ?? "" };
  }

  const card = section?.cards[context.cardIndex ?? 0];
  const bookmark =
    context.bookmarkIndex != null ? card?.bookmarks[context.bookmarkIndex] : undefined;
  return {
    cardTitle: String(context.cardIndex ?? 0),
    title: bookmark?.title ?? "",
    url: bookmark?.url ?? "",
    description: (bookmark?.description ?? "").slice(0, BOOKMARK_DESCRIPTION_MAX_LENGTH),
    badgeText: bookmark?.badgeText ?? "",
    badgeVariant: bookmark?.badgeVariant ?? "",
  };
}

export function EditDialog({ open, context, sections, onClose, onSubmit }: EditDialogProps) {
  useAdminDialogLayer(open);
  const [form, setForm] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<EditFieldErrors>({});
  const [shakeKey, setShakeKey] = useState(0);
  const [titleTouched, setTitleTouched] = useState(false);
  const isNewBookmarkRef = useRef(false);
  const initialUrlRef = useRef("");

  useEffect(() => {
    if (open && context) {
      const initialValues = getInitialValues(context, sections);
      setForm(initialValues);
      setFieldErrors({});
      setShakeKey(0);
      isNewBookmarkRef.current =
        context.type === "bookmark" && context.bookmarkIndex == null;
      initialUrlRef.current =
        context.type === "bookmark" ? (initialValues.url ?? "").trim() : "";
      setTitleTouched(context.type === "bookmark" && context.bookmarkIndex != null);
    }
  }, [open, context, sections]);

  const isBookmarkForm = context?.type === "bookmark";
  const isNewBookmark = isBookmarkForm && context.bookmarkIndex == null;
  const urlChangedFromInitial =
    isBookmarkForm && (form.url ?? "").trim() !== initialUrlRef.current;
  const { loading: metadataLoading, error: metadataError, suggestedDescription, fetchMetadata } =
    useBookmarkUrlMetadata({
      enabled: open && isBookmarkForm,
      autoFetch: isNewBookmark || urlChangedFromInitial,
      url: form.url ?? "",
      title: form.title ?? "",
      titleTouched,
      onApplyTitle: (title) => {
        setForm((prev) => ({ ...prev, title }));
      },
    });

  if (!context) return null;

  const isCompactForm = context.type === "section" || context.type === "card";
  const section = sections[context.sectionIndex];

  function markTitleEdited() {
    setTitleTouched(true);
  }

  function resetTitleForNewUrl() {
    setTitleTouched(false);
  }

  function updateField(name: string, value: string) {
    if (name === "title") markTitleEdited();
    if (name === "url" && value.trim() !== initialUrlRef.current) resetTitleForNewUrl();
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "title" || name === "url") {
      setFieldErrors((prev) => {
        if (!prev[name as keyof EditFieldErrors])
          return prev;
        const next = { ...prev };
        delete next[name as keyof EditFieldErrors];
        return next;
      });
    }
  }

  function triggerFieldErrors(errors: EditFieldErrors) {
    setFieldErrors(errors);
    setShakeKey((key) => key + 1);
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!context) return;

    const payload = { ...form };
    if (context.type === "bookmark" && !(payload.title ?? "").trim()) {
      const fallbackTitle = titleFallbackForSubmit(payload.url ?? "");
      if (fallbackTitle) payload.title = fallbackTitle;
    }

    const errors: EditFieldErrors = {};
    if (!(payload.title ?? "").trim())
      errors.title = true;
    if (context.type === "bookmark" && !(payload.url ?? "").trim())
      errors.url = true;

    if (errors.title || errors.url) {
      triggerFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onSubmit(payload);
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        showOverlay={false}
        className="flex max-h-[min(85vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="shrink-0 space-y-1.5 px-6 pb-3 pt-5">
          <DialogTitle>{getTitle(context, sections)}</DialogTitle>
          <DialogDescription className="sr-only">
            编辑书签、分组或模块的表单。
          </DialogDescription>
        </DialogHeader>
        <form
          className={cn(
            "flex flex-col overflow-hidden",
            !isCompactForm && "min-h-0 flex-1",
          )}
          noValidate
          onSubmit={handleSubmit}
        >
          <div
            className={cn(
              "app-scrollbar px-6",
              isCompactForm ? "pb-1" : "min-h-0 flex-1 overflow-y-auto",
            )}
          >
            <div className={cn(isCompactForm ? "pb-3" : "pb-4")}>
              {context.type === "bookmark" ? (
                <BookmarkEditFields
                  form={form}
                  fieldErrors={fieldErrors}
                  shakeKey={shakeKey}
                  section={section}
                  isNewBookmark={isNewBookmark}
                  autoFocusUrl={isNewBookmarkRef.current}
                  metadataLoading={metadataLoading}
                  metadataError={metadataError}
                  suggestedDescription={suggestedDescription}
                  onFieldChange={updateField}
                  onFetchMetadata={fetchMetadata}
                />
              ) : (
                <FieldGroup className="gap-4">
                  <ShakeInputField
                    id="title"
                    label="标题"
                    value={form.title ?? ""}
                    onChange={(value) => updateField("title", value)}
                    shakeKey={shakeKey}
                    invalid={fieldErrors.title}
                    errorMessage={fieldErrors.title ? "请输入标题" : undefined}
                  />
                </FieldGroup>
              )}
            </div>
          </div>

          <DialogFooter className="shrink-0 gap-2 border-t px-6 py-3.5 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">确认</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
