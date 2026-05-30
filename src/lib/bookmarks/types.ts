export interface BookmarkLink {
  title: string;
  url: string;
}

export interface BookmarkData {
  title: string;
  url: string;
  description?: string;
  badgeText?: string;
  badgeVariant?: string;
  extraLinks?: BookmarkLink[];
  sortOrder: number;
}

export interface BookmarkCardData {
  title: string;
  sortOrder: number;
  bookmarks: BookmarkData[];
}

export interface BookmarkSectionData {
  title: string;
  sortOrder: number;
  stagger: boolean;
  cards: BookmarkCardData[];
}

export interface VersionEntry {
  id: string;
  createdAt: string;
  sectionCount: number;
  cardCount: number;
  bookmarkCount: number;
}
