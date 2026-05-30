import { getCollection } from "astro:content";

const BLOG_INDEX_ID = "blog/index";

function compareBlogDocs(
  a: { id: string; data: { sidebar?: { order?: number } } },
  b: { id: string; data: { sidebar?: { order?: number } } },
) {
  const orderA = a.data.sidebar?.order ?? Number.POSITIVE_INFINITY;
  const orderB = b.data.sidebar?.order ?? Number.POSITIVE_INFINITY;
  if (orderA !== orderB) return orderA - orderB;
  return a.id.localeCompare(b.id);
}

/** 按 sidebar.order 返回博客目录下第一篇（不含 index），无文章时回退 /blog/ */
export async function getFirstBlogPostHref(): Promise<string> {
  const docs = await getCollection("docs");
  const first = docs
    .filter((doc) => doc.id.startsWith("blog/") && doc.id !== BLOG_INDEX_ID)
    .sort(compareBlogDocs)[0];

  return first ? `/${first.id}/` : "/blog/";
}
