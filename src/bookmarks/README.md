# 书签模块（`src/bookmarks`）

`/bookmarks/nav/` 导航页与 `/bookmarks/admin/` 管理端。按 **shared / nav / admin** 三表面组织，对齐 `src/theme/` 单模块单根约定。

- 仓库总览：[README.md](../../README.md#书签管理端)
- Agent 约定：`.cursor/skills/wwlight-project/SKILL.md` →「书签模块要点」
- 结构优化：`.cursor/skills/module-structure/SKILL.md`
- **路由与 path alias（唯一说明）**：`.cursor/skills/module-structure/paths.md`

## 模块范围（模块外）

| 路径 | 职责 |
| --- | --- |
| `db/data/bookmarks.ts` | 唯一可提交数据源 |
| `db/config.ts` / `db/seed.ts` | Astro DB 表与 seed |
| `src/pages/bookmarks/nav.astro` | 导航页 Astro 薄入口 → `/bookmarks/nav/`（旧 `/bookmarks/` 已 301，见 paths.md） |
| `src/pages/bookmarks/admin.astro` | 管理端 Astro 薄入口 → `/bookmarks/admin/` |
| `integrations/bookmarks-admin.ts` | dev 中间件 `/admin/api/*` |
| `src/components/HeaderBookmarksLink.astro` | Starlight 顶栏入口 |

## 目录

| 路径 | 职责 |
| --- | --- |
| `shared/` | 两表面共用：类型、数据管线、搜索/统计、favicon、共用组件与 theme CSS |
| `shared/data/` | `queries`、`page-data`、`serialize` |
| `shared/lib/` | `search`、`stats`、`section-helpers`、`toolbar-ui`、`badge-variants`、`favicon` |
| `shared/components/` | `BookmarkFavicon`、`BookmarkPageHeader`、`BookmarkStatsCards`、`UserAvatar` |
| `shared/styles/` | `bookmarks-theme-shared.css` |
| `nav/` | 导航 `/bookmarks/nav/`：React 组件与页面样式 |
| `admin/` | 管理端 `/bookmarks/admin/`：鉴权、API、编辑 UI、admin 样式 |
| `admin/lib/` | `admin-auth`、`admin-api`、`admin-helpers`、`admin-api.server` 等 |
| `admin/components/` | `AdminApp`、对话框、卡片网格、中转站等 |
| `admin/styles/` | `admin.css`、`bookmarks-app.css`、`bookmarks-tokens.css` |

## 数据流

```text
db/data/bookmarks.ts → db/seed.ts → Astro DB
  → getBookmarkSections() → Astro 页面 JSON 注水 → React 岛屿
管理端 dev：POST /admin/api/save → serialize → 写 bookmarks.ts → touchSeed
```

## 已知限制

- 管理端 API **仅 dev** 可写；静态 build 返回 403，线上用导出 TS 兜底。
- 鉴权为 `PUBLIC_BOOKMARKS_ADMIN_HASH` + sessionStorage Token，非服务端鉴权。
- `nav/components/ui-helpers.ts` 与 `admin/components/ui-helpers.ts` 各管卡片 Tailwind，未抽共享。

## 对外入口

- `@/bookmarks/shared/types` — 领域类型
- `@/bookmarks/shared/data/queries` — `getBookmarkSections()`
- `@/bookmarks/shared/data/page-data` — JSON 注水读写
- `@/bookmarks/nav/components/NavBookmarksPage` — 导航页 React 根
- `@/bookmarks/admin/lib/admin-auth` — 登录与 Token
- `@/bookmarks/admin/lib/admin-api` — 客户端 save / versions
- `@/bookmarks/admin/components/BookmarksAdmin` — 管理端 React 根
