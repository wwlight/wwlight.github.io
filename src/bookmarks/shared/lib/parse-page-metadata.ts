/**
 * 功能：从 HTML 片段解析 og / twitter / title / description。
 * 关联：bookmark-url-metadata.ts
 */

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function matchMeta(html: string, attr: "property" | "name", key: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${key}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) return decodeHtmlEntities(match[1].trim());
  }

  return undefined;
}

function matchTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtmlEntities(match[1].trim()) : undefined;
}

export function parsePageMetadata(html: string): { title?: string; description?: string } {
  const title =
    matchMeta(html, "property", "og:title") ??
    matchMeta(html, "name", "twitter:title") ??
    matchTitle(html);
  const description =
    matchMeta(html, "property", "og:description") ?? matchMeta(html, "name", "description");

  return {
    title: title || undefined,
    description: description || undefined,
  };
}
