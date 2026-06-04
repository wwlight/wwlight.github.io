/** Logo.dev 书签站点图标（publishable key，见 https://docs.logo.dev/logo-images/get） */

const LOGO_DEV_SIZE_PX = 80;

export function logoDevPublishableToken(): string {
  return (import.meta.env.PUBLIC_LOGO_DEV_TOKEN ?? "").trim();
}

/** 用于 Logo API 的注册域名（去掉 www. 前缀）。 */
export function logoDevDomainFromHostname(hostname: string): string {
  return hostname.replace(/^www\./i, "");
}

export function logoDevImageUrl(hostname: string): string | null {
  const token = logoDevPublishableToken();
  if (!token) return null;

  const domain = logoDevDomainFromHostname(hostname);
  const params = new URLSearchParams({
    token,
    size: String(LOGO_DEV_SIZE_PX),
    format: "webp",
    retina: "true",
    fallback: "monogram",
  });

  return `https://img.logo.dev/${encodeURIComponent(domain)}?${params.toString()}`;
}
