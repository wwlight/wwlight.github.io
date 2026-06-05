/**
 * 功能：书签 URL 规范化、HTML 元数据合并、域名标题回退与提交兜底。
 * 关联：parse-page-metadata.ts、fetch-bookmark-metadata.client.ts、admin-api.server.ts
 */
import { parsePageMetadata } from "./parse-page-metadata";

export const BOOKMARK_METADATA_FETCH_TIMEOUT_MS = 8_000;

export interface BookmarkUrlMetadata {
  title?: string;
  description?: string;
}

export function normalizeBookmarkUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function titleFromHostname(url: string): string | undefined {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, "");
    const label = hostname.split(".")[0]?.trim();
    if (!label) return undefined;
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return undefined;
  }
}

export function metadataFromHtml(html: string, url: string): BookmarkUrlMetadata {
  const parsed = parsePageMetadata(html);
  return {
    title: parsed.title ?? titleFromHostname(url),
    description: parsed.description,
  };
}

export function fallbackMetadataFromUrl(url: string): BookmarkUrlMetadata | null {
  const normalized = normalizeBookmarkUrl(url);
  if (!normalized) return null;

  const title = titleFromHostname(normalized);
  return title ? { title } : null;
}

/** 提交兜底：debounce 未完成或识别失败时，至少用域名填充标题 */
export function titleFallbackForSubmit(url: string): string | undefined {
  return fallbackMetadataFromUrl(url)?.title;
}
