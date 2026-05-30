export const BOOKMARK_BADGE_VARIANTS = [
  { value: "", label: "默认", hint: "跟随主题色" },
  { value: "success", label: "成功", hint: "推荐 / 免费" },
  { value: "tip", label: "提示", hint: "插件 / 工具" },
  { value: "hot", label: "热门", hint: "hot / 焦点" },
  { value: "warning", label: "警告", hint: "限时 / 注意" },
  { value: "info", label: "信息", hint: "文档 / 说明" },
  { value: "github", label: "Github", hint: "开源 / 仓库" },
  { value: "purple", label: "紫色", hint: "品牌 / 特色" },
  { value: "outline", label: "描边", hint: "轻量中性" },
] as const;

export type BookmarkBadgeVariantName =
  | "success"
  | "tip"
  | "hot"
  | "warning"
  | "info"
  | "github"
  | "purple"
  | "outline"
  | "secondary";

const variantSet = new Set<string>(
  BOOKMARK_BADGE_VARIANTS.map((item) => item.value).filter(Boolean),
);

export function resolveBookmarkBadgeVariant(variant?: string): BookmarkBadgeVariantName {
  if (variant && variantSet.has(variant)) return variant as BookmarkBadgeVariantName;
  return "secondary";
}
