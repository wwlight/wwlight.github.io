/**
 * 功能：dev API 侧 Token 校验（Node crypto）。
 * 关联：integrations/bookmarks-admin.ts → requireAdminAuth
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");

function canonicalPasswordHash(hash: string) {
  return hash.trim().toLowerCase();
}

function readEnvPasswordHash() {
  try {
    const envPath = path.join(projectRoot, ".env");
    if (!fs.existsSync(envPath)) return "";
    const match = fs.readFileSync(envPath, "utf-8").match(/^PUBLIC_BOOKMARKS_ADMIN_HASH=(.+)$/m);
    return match?.[1]?.trim() ?? "";
  } catch {
    return "";
  }
}

export function getServerPasswordHash(): string {
  return (
    process.env.PUBLIC_BOOKMARKS_ADMIN_HASH ??
    import.meta.env.PUBLIC_BOOKMARKS_ADMIN_HASH ??
    readEnvPasswordHash()
  ).trim();
}

export function verifyAdminToken(token: string, passwordHash?: string): boolean {
  const hash = canonicalPasswordHash(passwordHash ?? "");
  if (!hash || !token) return false;

  const raw = token.startsWith("Bearer ") ? token.slice(7) : token;

  try {
    const { exp, proof } = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    if (typeof exp !== "number" || typeof proof !== "string") return false;
    if (Date.now() > exp) return false;

    const expected = crypto.createHash("sha256").update(`${hash}:${exp}`).digest("hex");
    return proof === expected;
  } catch {
    return false;
  }
}
