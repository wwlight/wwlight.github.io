import type { BookmarkSectionData, VersionEntry } from "./types";

async function authFetch<T>(url: string, authorization: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      ...init?.headers,
    },
  });

  const text = await response.text();
  let result = {} as T & { error?: string };
  if (text) {
    try {
      result = JSON.parse(text) as T & { error?: string };
    } catch {
      throw new Error(response.ok ? "响应格式错误" : `请求失败 (${response.status})`);
    }
  }

  if (!response.ok) throw new Error(result.error ?? `请求失败 (${response.status})`);
  return result;
}

export async function fetchVersions(authorization: string): Promise<VersionEntry[]> {
  const result = await authFetch<{ versions?: VersionEntry[] }>(
    "/admin/api/versions",
    authorization,
  );
  return result.versions ?? [];
}

export async function fetchVersionSections(
  authorization: string,
  id: string,
): Promise<BookmarkSectionData[]> {
  const result = await authFetch<{ sections?: BookmarkSectionData[] }>(
    `/admin/api/versions?id=${encodeURIComponent(id)}`,
    authorization,
  );
  return result.sections ?? [];
}

export async function saveSectionsToProject(
  authorization: string,
  sections: BookmarkSectionData[],
) {
  return authFetch("/admin/api/save", authorization, {
    method: "POST",
    body: JSON.stringify({ sections }),
  });
}

export async function restoreVersionToProject(
  authorization: string,
  id: string,
): Promise<{ sections: BookmarkSectionData[] }> {
  return authFetch<{ sections: BookmarkSectionData[] }>("/admin/api/restore", authorization, {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
