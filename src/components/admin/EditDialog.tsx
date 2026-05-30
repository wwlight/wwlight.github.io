import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
} from "@/lib/bookmarks/badge-variants";
import type { EditContext } from "@/lib/bookmarks/admin-helpers";
import { formatExtraLinksInput } from "@/lib/bookmarks/admin-helpers";
import type { BookmarkSectionData } from "@/lib/bookmarks/types";

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
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && context) setForm(getInitialValues(context, sections));
  }, [open, context, sections]);

  if (!context) return null;

  const section = sections[context.sectionIndex];

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle(context, sections)}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
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
            <Input
              id="title"
              value={form.title ?? ""}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>

          {context.type === "bookmark" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="url">链接 URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={form.url ?? ""}
                  onChange={(e) => updateField("url", e.target.value)}
                  placeholder="https://example.com"
                  required
                />
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

          <DialogFooter>
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
