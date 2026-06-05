/**
 * 功能：dev 中间件 save / restore / versions 的业务 handler。
 * 关联：integrations/bookmarks-admin.ts
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getServerPasswordHash, verifyAdminToken } from "./admin-auth.server";
import {
  archiveVersion,
  getVersionSections,
  listVersions,
  touchSeed,
} from "./admin-versions.server";
import {
  BOOKMARK_METADATA_FETCH_TIMEOUT_MS,
  fallbackMetadataFromUrl,
  metadataFromHtml,
  normalizeBookmarkUrl,
} from "../../shared/lib/bookmark-url-metadata";
import { serializeBookmarkSections } from "../../shared/data/serialize";
import type { BookmarkSectionData } from "../../shared/types";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function requireAdminAuth(request: Request): Response | null {
  const passwordHash = getServerPasswordHash();
  const authorization = request.headers.get("Authorization") ?? "";
  if (!passwordHash) return json({ error: "未配置 PUBLIC_BOOKMARKS_ADMIN_HASH" }, 500);
  if (!verifyAdminToken(authorization, passwordHash))
    return json({ error: "未授权，请重新登录" }, 401);
  return null;
}

function validateSections(sections: unknown) {
  if (!Array.isArray(sections) || sections.length === 0)
    return { ok: false as const, error: "拒绝保存空数据" };

  const bookmarkCount = sections.reduce(
    (sum: number, section: { cards: Array<{ bookmarks: unknown[] }> }) =>
      sum + section.cards.reduce((n, card) => n + card.bookmarks.length, 0),
    0,
  );
  if (bookmarkCount === 0) return { ok: false as const, error: "拒绝保存空书签列表" };

  return { ok: true as const, bookmarkCount };
}

function refreshBookmarkLogoCache() {
  try {
    execSync("node scripts/generate-bookmark-logos.mjs", {
      cwd: projectRoot,
      stdio: "pipe",
    });
  } catch {
    // 生成失败不阻断保存
  }
}

function writeBookmarksFile(sections: BookmarkSectionData[]) {
  const content = serializeBookmarkSections(sections);
  const filePath = path.resolve(projectRoot, "db/data/bookmarks.ts");
  if (fs.existsSync(filePath)) fs.copyFileSync(filePath, `${filePath}.bak`);
  fs.writeFileSync(filePath, content, "utf-8");
  touchSeed(projectRoot);
  refreshBookmarkLogoCache();
}

export async function handleFetchMetadata(request: Request) {
  const rawUrl = new URL(request.url).searchParams.get("url") ?? "";
  const normalized = normalizeBookmarkUrl(rawUrl);
  if (!normalized) return json({ error: "无效的 URL" }, 400);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BOOKMARK_METADATA_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(normalized, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "wwlight-bookmarks-admin/1.0",
      },
    });

    if (!response.ok) {
      const fallback = fallbackMetadataFromUrl(normalized);
      return fallback ? json(fallback) : json({ error: "获取页面失败" }, 502);
    }

    const html = await response.text();
    const metadata = metadataFromHtml(html, normalized);
    const title = metadata.title?.trim();
    if (!title) {
      const fallback = fallbackMetadataFromUrl(normalized);
      return fallback ? json(fallback) : json({ error: "未识别到页面标题" }, 404);
    }

    return json({
      title,
      description: metadata.description?.trim() || undefined,
    });
  } catch {
    const fallback = fallbackMetadataFromUrl(normalized);
    return fallback ? json(fallback) : json({ error: "获取页面失败" }, 502);
  } finally {
    clearTimeout(timeout);
  }
}

export function handleListVersions() {
  return json({ versions: listVersions(projectRoot) });
}

export function handleGetVersion(id: string) {
  const sections = getVersionSections(projectRoot, id);
  if (!sections) return json({ error: "版本不存在" }, 404);
  return json({ sections });
}

export async function handleSave(request: Request) {
  if (!import.meta.env.DEV) return json({ error: "仅开发环境可用" }, 403);

  const body = await request.json();
  const check = validateSections(body.sections);
  if (!check.ok) return json({ error: check.error }, 400);

  archiveVersion(projectRoot, body.sections);
  writeBookmarksFile(body.sections as BookmarkSectionData[]);
  return json({ ok: true, bookmarkCount: check.bookmarkCount });
}

export async function handleRestore(request: Request) {
  if (!import.meta.env.DEV) return json({ error: "仅开发环境可用" }, 403);

  const body = await request.json();
  const sections = getVersionSections(projectRoot, body.id);
  if (!sections) return json({ error: "版本不存在" }, 404);

  const check = validateSections(sections);
  if (!check.ok) return json({ error: check.error }, 400);

  writeBookmarksFile(sections as BookmarkSectionData[]);
  return json({ ok: true, sections, bookmarkCount: check.bookmarkCount });
}
