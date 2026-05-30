export interface SiteModuleNavItem {
  label: string;
  href: string;
  prefix: string;
}

export const bookmarksNavItem = {
  label: "书签",
  href: "/bookmarks/",
  prefix: "/bookmarks",
} as const;

export const siteModuleNav: SiteModuleNavItem[] = [
  { label: "博客", href: "/blog/", prefix: "/blog" },
  { label: "备忘录", href: "/memorandum/dev-qa/", prefix: "/memorandum" },
  { label: "工具集", href: "/tools/git-cheatsheet/", prefix: "/tools" },
  { label: "系统", href: "/system/system-software/", prefix: "/system" },
  { label: "其他", href: "/other/pinyin-flypy/", prefix: "/other" },
];

export function isModuleNavActive(prefix: string, pathname: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
