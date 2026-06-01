/** 功能：从书签 URL 解析 Google favicon 服务地址 */
export function faviconUrl(url: string) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "";
  }
}
