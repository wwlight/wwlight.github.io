/** 功能：书签卡片 favicon 候选 URL（站点 → DuckDuckGo；不用 Google 泛型占位图）。 */
export function faviconCandidates(url: string): string[] {
  try {
    const parsed = new URL(url);
    return [
      `${parsed.origin}/favicon.ico`,
      `https://icons.duckduckgo.com/ip3/${parsed.hostname}.ico`,
    ];
  } catch {
    return [];
  }
}

function loadFirstFavicon(candidates: string[]): Promise<string | null> {
  if (candidates.length === 0) return Promise.resolve(null);

  return new Promise((resolve) => {
    let index = 0;

    function tryNext() {
      if (index >= candidates.length) {
        resolve(null);
        return;
      }

      const src = candidates[index++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(src);
      img.onerror = () => tryNext();
      img.src = src;
    }

    tryNext();
  });
}

/** 按候选顺序探测，返回首个可加载的 favicon URL。 */
export function resolveFaviconFromCandidates(candidates: string[]): Promise<string | null> {
  return loadFirstFavicon(candidates);
}
