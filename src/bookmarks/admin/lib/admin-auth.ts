/**
 * 功能：管理端客户端鉴权——密码 hash 比对、sessionStorage Token、首屏防闪屏。
 */
const SESSION_KEY = "bookmarks-admin-session";
const PROFILE_KEY = "bookmarks-admin-profile";

export const ADMIN_DISPLAY_NAME = "admin";

export interface AdminProfile {
  name: string;
}

let configuredHash = "";

export function configureAdminPasswordHash(hash: string) {
  configuredHash = hash.trim();
}

export function getAdminPasswordHash(): string {
  return configuredHash;
}

export async function sha256(value: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeHash(hash: string) {
  return hash.trim().toLowerCase();
}

function hashForToken(passwordHash: string) {
  return normalizeHash(passwordHash);
}

export async function createSessionToken(passwordHash: string): Promise<string> {
  const hash = hashForToken(passwordHash);
  const exp = Date.now() + 24 * 60 * 60 * 1000;
  const proof = await sha256(`${hash}:${exp}`);
  return btoa(JSON.stringify({ exp, proof }));
}

export async function verifySessionToken(token: string, passwordHash: string): Promise<boolean> {
  const hash = hashForToken(passwordHash);
  if (!hash || !token) return false;

  try {
    const { exp, proof } = JSON.parse(atob(token));
    if (typeof exp !== "number" || typeof proof !== "string") return false;
    if (Date.now() > exp) return false;
    const expected = await sha256(`${hash}:${exp}`);
    return proof === expected;
  } catch {
    return false;
  }
}

export function getStoredSessionToken(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function storeSessionToken(token: string) {
  sessionStorage.setItem(SESSION_KEY, token);
}

export function clearSessionToken() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(PROFILE_KEY);
}

export function getStoredAdminProfile(): AdminProfile | null {
  const raw = sessionStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    const profile = JSON.parse(raw) as AdminProfile;
    if (typeof profile.name === "string" && profile.name.trim())
      return { name: profile.name.trim() };
    return null;
  } catch {
    return null;
  }
}

export function storeAdminProfile(profile: AdminProfile) {
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify({ name: profile.name.trim() }));
}

export function getDisplayInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return trimmed.slice(0, 2);
}

export async function loginWithPassword(password: string): Promise<boolean> {
  const passwordHash = getAdminPasswordHash();
  if (!passwordHash) return false;

  const inputHash = normalizeHash(await sha256(password));
  if (inputHash !== normalizeHash(passwordHash)) return false;

  const token = await createSessionToken(passwordHash);
  storeSessionToken(token);
  storeAdminProfile({ name: ADMIN_DISPLAY_NAME });
  return true;
}

/** 同步校验 token 是否未过期（不验证 proof，用于首屏避免闪屏） */
export function hasValidSessionTokenSync(): boolean {
  const token = getStoredSessionToken();
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token));
    return typeof exp === "number" && Date.now() <= exp;
  } catch {
    return false;
  }
}

export interface AdminSessionState {
  authenticated: boolean;
  userName: string;
}

/** 首屏会话状态：token 未过期则乐观视为已登录，后续再异步校验 proof */
export function getInitialAdminSession(): AdminSessionState {
  if (!getAdminPasswordHash() || !hasValidSessionTokenSync()) {
    return { authenticated: false, userName: ADMIN_DISPLAY_NAME };
  }

  const profile = getStoredAdminProfile();
  return {
    authenticated: true,
    userName: profile?.name ?? ADMIN_DISPLAY_NAME,
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const passwordHash = getAdminPasswordHash();
  if (!passwordHash) return false;

  const token = getStoredSessionToken();
  if (!token) return false;

  return verifySessionToken(token, passwordHash);
}

export async function getAuthorizationHeader(): Promise<string | null> {
  const token = getStoredSessionToken();
  if (!token || !(await isAdminAuthenticated())) return null;
  return `Bearer ${token}`;
}
