/** 构建期生成的书签 Logo 映射（按 URL → domain，运行时拼 Logo.dev URL） */
import cache from "@/bookmarks/shared/data/bookmark-logos.json";
import { logoDevDomainFromHostname, logoDevImageUrl } from "@/bookmarks/shared/lib/logo-dev";

export interface BookmarkLogoCacheEntry {
  domain: string;
}

export interface BookmarkLogoCacheFile {
  version: number;
  sourceFingerprint: string;
  byUrl: Record<string, BookmarkLogoCacheEntry>;
}

const logoCache = cache as BookmarkLogoCacheFile;

export function bookmarkLogoCacheFingerprint(): string {
  return logoCache.sourceFingerprint;
}

export function domainFromBookmarkUrl(url: string): string | null {
  try {
    return logoDevDomainFromHostname(new URL(url).hostname);
  } catch {
    return null;
  }
}

/** 仅 Logo.dev；domain 来自构建缓存，缺项时按 URL 推导。 */
export function resolveBookmarkLogoImageUrl(url: string): string | null {
  const domain = logoCache.byUrl[url]?.domain ?? domainFromBookmarkUrl(url);
  if (!domain) return null;
  return logoDevImageUrl(domain);
}
