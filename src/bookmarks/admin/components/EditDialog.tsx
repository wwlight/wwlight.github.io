import { useEffect, useState } from "react";
import { useAdminDialogLayer } from "@/bookmarks/admin/components/AdminDialogLayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BOOKMARK_BADGE_VARIANTS,
  resolveBookmarkBadgeVariant,
} from "@/bookmarks/shared/lib/badge-variants";
import type { EditContext } from "@/bookmarks/admin/lib/admin-helpers";
import { formatExtraLinksInput } from "@/bookmarks/admin/lib/admin-helpers";
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
    description: bookmark?.description ?? "",
    badgeText: bookmark?.badgeText ?? "",
    badgeVariant: bookmark?.badgeVariant ?? "",
    extraLinks: formatExtraLinksInput(bookmark?.extraLinks),
  };
}

export function EditDialog({ open, context, sections, onClose, onSubmit }: EditDialogProps) {
  useAdminDialogLayer(open);
  const [form, setForm] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<EditFieldErrors>({});
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (open && context) {
      setForm(getInitialValues(context, sections));
      setFieldErrors({});
      setShakeKey(0);
    }
  }, [open, context, sections]);

  if (!context) return null;

  const section = sections[context.sectionIndex];

  function updateField(name: string, value: string) {
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const errors: EditFieldErrors = {};
    if (!(form.title ?? "").trim())
      errors.title = true;
    if (context.type === "bookmark" && !(form.url ?? "").trim())
      errors.url = true;

    if (errors.title || errors.url) {
      triggerFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        showOverlay={false}
        className="flex max-h-[min(85vh,720px)] min-h-[min(24rem,70vh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="shrink-0 space-y-1.5 px-6 pb-4 pt-6">
          <DialogTitle>{getTitle(context, sections)}</DialogTitle>
          <DialogDescription className="sr-only">
            编辑书签、分组或模块的表单。
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto px-6">
            <div className="grid gap-4 pb-4">
          {context.type === "bookmark" && (
            <div className="grid gap-2">
              <Label htmlFor="cardTitle">所属分组</Label>
              <Select
                value={form.cardTitle ?? "0"}
                onValueChange={(value) => updateField("cardTitle", value)}
              >
                <SelectTrigger id="cardTitle">
                  <SelectValue placeholder="选择分组" />
                </SelectTrigger>
                <SelectContent>
                  {section?.cards.map((card, index) => (
                    <SelectItem key={card.title + index} value={String(index)}>
                      {card.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="title">标题</Label>
            <div
              key={fieldErrors.title ? `title-shake-${shakeKey}` : "title"}
              className={cn(fieldErrors.title && shakeKey > 0 && "animate-input-shake")}
            >
              <Input
                id="title"
                value={form.title ?? ""}
                onChange={(e) => updateField("title", e.target.value)}
                invalid={fieldErrors.title}
                aria-label="标题"
              />
            </div>
            {fieldErrors.title ? (
              <p className="text-sm text-destructive" role="alert">
                请输入标题
              </p>
            ) : null}
          </div>

          {context.type === "bookmark" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="url">链接 URL</Label>
                <div
                  key={fieldErrors.url ? `url-shake-${shakeKey}` : "url"}
                  className={cn(fieldErrors.url && shakeKey > 0 && "animate-input-shake")}
                >
                  <Input
                    id="url"
                    type="text"
                    inputMode="url"
                    value={form.url ?? ""}
                    onChange={(e) => updateField("url", e.target.value)}
                    placeholder="https://example.com"
                    invalid={fieldErrors.url}
                    aria-label="链接 URL"
                  />
                </div>
                {fieldErrors.url ? (
                  <p className="text-sm text-destructive" role="alert">
                    请输入链接 URL
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={form.description ?? ""}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="badgeText">标签文字</Label>
                <Input
                  id="badgeText"
                  value={form.badgeText ?? ""}
                  onChange={(e) => updateField("badgeText", e.target.value)}
                  placeholder="hot / 推荐 / Github"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="badgeVariant">标签样式</Label>
                <Select
                  value={form.badgeVariant || "__default__"}
                  onValueChange={(value) =>
                    updateField("badgeVariant", value === "__default__" ? "" : value)
                  }
                >
                  <SelectTrigger id="badgeVariant">
                    <SelectValue placeholder="默认">
                      {form.badgeVariant ? (
                        <Badge
                          variant={resolveBookmarkBadgeVariant(form.badgeVariant)}
                          className="rounded-full px-1.5 py-0 text-[10px]"
                        >
                          {BOOKMARK_BADGE_VARIANTS.find((item) => item.value === form.badgeVariant)
                            ?.label ?? form.badgeVariant}
                        </Badge>
                      ) : (
                        "默认"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {BOOKMARK_BADGE_VARIANTS.map(({ value, label, hint }) => (
                      <SelectItem key={value || "__default__"} value={value || "__default__"}>
                        <div className="flex items-center gap-2.5">
                          <Badge
                            variant={resolveBookmarkBadgeVariant(value || undefined)}
                            className="rounded-full px-1.5 py-0 text-[10px]"
                          >
                            {label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{hint}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="extraLinks">附加链接（每行：标题|URL）</Label>
                <Textarea
                  id="extraLinks"
                  value={form.extraLinks ?? ""}
                  onChange={(e) => updateField("extraLinks", e.target.value)}
                  placeholder="Sunshine|https://github.com/..."
                />
              </div>
            </>
          )}

            </div>
          </div>

          <DialogFooter className="shrink-0 gap-2 border-t px-6 py-4 sm:gap-0">
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
