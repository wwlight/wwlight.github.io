/**
 * 功能：客户端解析书签链接元数据（dev API → 直连 → CORS 代理 → 域名回退）。
 * 关联：useBookmarkUrlMetadata.ts、admin-api.ts、bookmark-url-metadata.ts
 */
import { fetchBookmarkMetadataFromApi } from "@/bookmarks/admin/lib/admin-api";
import {
  BOOKMARK_METADATA_FETCH_TIMEOUT_MS,
  fallbackMetadataFromUrl,
  metadataFromHtml,
  normalizeBookmarkUrl,
  type BookmarkUrlMetadata,
} from "@/bookmarks/shared/lib/bookmark-url-metadata";

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), BOOKMARK_METADATA_FETCH_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

async function readHtmlFromResponse(response: Response): Promise<string | null> {
  if (!response.ok) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !contentType.includes("text/html") && !contentType.includes("text/plain"))
    return null;

  const html = await response.text();
  return html.trim() ? html : null;
}

async function fetchHtmlDirect(url: string): Promise<string | null> {
  try {
    const response = await fetchWithTimeout(url, {
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    return await readHtmlFromResponse(response);
  } catch {
    return null;
  }
}

async function fetchHtmlViaProxy(url: string): Promise<string | null> {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetchWithTimeout(proxyUrl);
    return await readHtmlFromResponse(response);
  } catch {
    return null;
  }
}

async function fetchViaDevApi(
  url: string,
  authorization: string,
): Promise<BookmarkUrlMetadata | null> {
  try {
    const result = await fetchBookmarkMetadataFromApi(authorization, url);
    return result.title?.trim() ? result : null;
  } catch {
    // dev API 不可用时走客户端回退（生产 / preview）
    return null;
  }
}

async function fetchViaClientHtml(url: string): Promise<BookmarkUrlMetadata | null> {
  const html = (await fetchHtmlDirect(url)) ?? (await fetchHtmlViaProxy(url));
  if (!html) return null;

  const metadata = metadataFromHtml(html, url);
  return metadata.title?.trim() ? metadata : null;
}

/**
 * 1. dev `/admin/api/fetch-metadata`（需登录）
 * 2. 浏览器直连目标页 HTML
 * 3. CORS 代理（allorigins）
 * 4. 域名推导标题
 */
export async function resolveBookmarkMetadata(
  rawUrl: string,
  authorization?: string | null,
): Promise<BookmarkUrlMetadata | null> {
  const normalized = normalizeBookmarkUrl(rawUrl);
  if (!normalized) return null;

  if (authorization) {
    const fromApi = await fetchViaDevApi(normalized, authorization);
    if (fromApi) return fromApi;
  }

  const fromHtml = await fetchViaClientHtml(normalized);
  if (fromHtml) return fromHtml;

  return fallbackMetadataFromUrl(normalized);
}
