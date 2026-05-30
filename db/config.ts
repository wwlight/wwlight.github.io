import { column, defineDb, defineTable } from "astro:db";

const BookmarkSection = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    sortOrder: column.number(),
    stagger: column.boolean({ default: true }),
  },
});

const BookmarkCard = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    sectionId: column.number(),
    title: column.text(),
    sortOrder: column.number(),
  },
});

const Bookmark = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    cardId: column.number(),
    title: column.text(),
    url: column.text(),
    description: column.text({ optional: true }),
    badgeText: column.text({ optional: true }),
    badgeVariant: column.text({ optional: true }),
    extraLinks: column.text({ optional: true }),
    sortOrder: column.number(),
  },
});

export default defineDb({
  tables: { BookmarkSection, BookmarkCard, Bookmark },
});
