/**
 * 功能：书签编辑表单字段（URL 识别、描述、标签）。
 * 关联：EditDialog.tsx、ShakeInputField.tsx
 */
import { ShakeInputField } from "@/bookmarks/admin/components/dialogs/ShakeInputField";
import { BOOKMARK_DESCRIPTION_MAX_LENGTH } from "@/bookmarks/admin/lib/admin-helpers";
import {
  BOOKMARK_BADGE_VARIANTS,
  resolveBookmarkBadgeVariant,
} from "@/bookmarks/shared/lib/badge-variants";
import type { BookmarkSectionData } from "@/bookmarks/shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface BookmarkEditFieldErrors {
  title?: boolean;
  url?: boolean;
}

interface BookmarkEditFieldsProps {
  form: Record<string, string>;
  fieldErrors: BookmarkEditFieldErrors;
  shakeKey: number;
  section: BookmarkSectionData | undefined;
  isNewBookmark: boolean;
  autoFocusUrl: boolean;
  metadataLoading: boolean;
  metadataError: string | null;
  suggestedDescription: string;
  onFieldChange: (name: string, value: string) => void;
  onFetchMetadata: () => void;
}

export function BookmarkEditFields({
  form,
  fieldErrors,
  shakeKey,
  section,
  isNewBookmark,
  autoFocusUrl,
  metadataLoading,
  metadataError,
  suggestedDescription,
  onFieldChange,
  onFetchMetadata,
}: BookmarkEditFieldsProps) {
  function applySuggestedDescription() {
    onFieldChange(
      "description",
      suggestedDescription.slice(0, BOOKMARK_DESCRIPTION_MAX_LENGTH),
    );
  }

  return (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel htmlFor="cardTitle">所属分组</FieldLabel>
        <Select
          value={form.cardTitle ?? "0"}
          onValueChange={(value) => onFieldChange("cardTitle", value)}
        >
          <SelectTrigger id="cardTitle">
            <SelectValue placeholder="选择分组" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {section?.cards.map((card, index) => (
                <SelectItem key={card.title + index} value={String(index)}>
                  {card.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field data-invalid={fieldErrors.url || undefined}>
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor="url">链接 URL</FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 shrink-0 px-2.5 text-xs"
            disabled={metadataLoading || !(form.url ?? "").trim()}
            onClick={onFetchMetadata}
          >
            {metadataLoading ? "识别中…" : "识别"}
          </Button>
        </div>
        <div
          key={fieldErrors.url ? `url-shake-${shakeKey}` : "url"}
          className={cn(fieldErrors.url && shakeKey > 0 && "animate-input-shake")}
        >
          <Input
            id="url"
            type="text"
            inputMode="url"
            value={form.url ?? ""}
            onChange={(e) => onFieldChange("url", e.target.value)}
            placeholder="https://example.com"
            invalid={fieldErrors.url}
            aria-label="链接 URL"
            autoFocus={autoFocusUrl}
          />
        </div>
        {fieldErrors.url ? (
          <FieldError>请输入链接 URL</FieldError>
        ) : metadataError ? (
          <FieldDescription role="status">{metadataError}</FieldDescription>
        ) : (
          <FieldDescription>
            {`${isNewBookmark ? "粘贴" : "修改"}链接后会自动识别网站标题，也可点击「识别」手动刷新`}
          </FieldDescription>
        )}
      </Field>

      <ShakeInputField
        id="title"
        label="标题"
        value={form.title ?? ""}
        onChange={(value) => onFieldChange("title", value)}
        shakeKey={shakeKey}
        invalid={fieldErrors.title}
        errorMessage={fieldErrors.title ? "请输入标题" : undefined}
        placeholder="根据链接自动识别"
      />

      <Field>
        <div className="flex items-center justify-between gap-2">
          <FieldLabel htmlFor="description">描述</FieldLabel>
          <span
            className="shrink-0 text-xs tabular-nums text-muted-foreground"
            aria-live="polite"
          >
            还可输入 {BOOKMARK_DESCRIPTION_MAX_LENGTH - (form.description ?? "").length} 字
          </span>
        </div>
        <Textarea
          id="description"
          rows={2}
          maxLength={BOOKMARK_DESCRIPTION_MAX_LENGTH}
          className="resize-none"
          value={form.description ?? ""}
          onChange={(e) =>
            onFieldChange(
              "description",
              e.target.value.slice(0, BOOKMARK_DESCRIPTION_MAX_LENGTH),
            )}
        />
        {suggestedDescription ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border bg-card px-3 py-2"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">识别到的描述</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 shrink-0 px-2 text-xs"
                onClick={applySuggestedDescription}
              >
                填入
              </Button>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {suggestedDescription}
            </p>
          </div>
        ) : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="badgeText">标签文字</FieldLabel>
        <Input
          id="badgeText"
          value={form.badgeText ?? ""}
          onChange={(e) => onFieldChange("badgeText", e.target.value)}
          placeholder="hot / 推荐 / Github"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="badgeVariant">标签样式</FieldLabel>
        <Select
          value={form.badgeVariant || "__default__"}
          onValueChange={(value) =>
            onFieldChange("badgeVariant", value === "__default__" ? "" : value)
          }
        >
          <SelectTrigger id="badgeVariant">
            <SelectValue placeholder="默认">
              {form.badgeVariant ? (
                <Badge
                  variant={resolveBookmarkBadgeVariant(form.badgeVariant)}
                  className="rounded-full px-1.5 py-0 text-badge"
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
            <SelectGroup>
              {BOOKMARK_BADGE_VARIANTS.map(({ value, label, hint }) => (
                <SelectItem key={value || "__default__"} value={value || "__default__"}>
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant={resolveBookmarkBadgeVariant(value || undefined)}
                      className="rounded-full px-1.5 py-0 text-badge"
                    >
                      {label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{hint}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
