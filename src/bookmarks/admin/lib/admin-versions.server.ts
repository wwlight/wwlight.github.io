/**
 * 功能：保存前版本快照归档、manifest 维护、touchSeed 触发 DB 重载。
 */
import fs from "node:fs";
import path from "node:path";
import type { VersionEntry } from "@/bookmarks/shared/types";

const MAX_VERSIONS = 40;

function countStats(sections: Array<{ cards: Array<{ bookmarks: unknown[] }> }>) {
  return {
    sectionCount: sections.length,
    cardCount: sections.reduce((n, s) => n + s.cards.length, 0),
    bookmarkCount: sections.reduce(
      (sum, s) => sum + s.cards.reduce((n, c) => n + c.bookmarks.length, 0),
      0,
    ),
  };
}

export function getVersionsDir(root: string) {
  return path.resolve(root, "db/data/versions");
}

function manifestPath(root: string) {
  return path.join(getVersionsDir(root), "manifest.json");
}

function versionFilePath(root: string, id: string) {
  return path.join(getVersionsDir(root), `${id}.json`);
}

function readManifest(root: string): VersionEntry[] {
  const file = manifestPath(root);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as VersionEntry[];
  } catch {
    return [];
  }
}

function writeManifest(root: string, entries: VersionEntry[]) {
  fs.mkdirSync(getVersionsDir(root), { recursive: true });
  fs.writeFileSync(manifestPath(root), JSON.stringify(entries, null, 2), "utf-8");
}

function makeVersionId() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export function listVersions(root: string): VersionEntry[] {
  return readManifest(root);
}

export function getVersionSections(root: string, id: string) {
  const file = versionFilePath(root, id);
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return data.sections ?? null;
  } catch {
    return null;
  }
}

export function archiveVersion(root: string, sections: unknown[]) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  const stats = countStats(sections as Array<{ cards: Array<{ bookmarks: unknown[] }> }>);
  if (stats.bookmarkCount === 0) return null;

  const id = makeVersionId();
  const dir = getVersionsDir(root);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(versionFilePath(root, id), JSON.stringify({ sections }, null, 2), "utf-8");

  const entry: VersionEntry = {
    id,
    createdAt: new Date().toISOString(),
    ...stats,
  };

  const previous = readManifest(root);
  const merged = [entry, ...previous];
  const manifest = merged.slice(0, MAX_VERSIONS);
  writeManifest(root, manifest);

  for (const removed of merged.slice(MAX_VERSIONS)) {
    const stale = versionFilePath(root, removed.id);
    if (fs.existsSync(stale)) fs.unlinkSync(stale);
  }

  return entry;
}

export function touchSeed(root: string) {
  const seedPath = path.resolve(root, "db/seed.ts");
  if (fs.existsSync(seedPath)) {
    const now = new Date();
    fs.utimesSync(seedPath, now, now);
  }
}
