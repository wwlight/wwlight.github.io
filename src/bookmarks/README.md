# 书签模块（`src/bookmarks`）

`/bookmarks/nav/` 导航页与 `/bookmarks/admin/` 管理端。页面 React 根在模块根目录；其余 UI 在 `components/` 下按功能分子目录。

- 仓库总览：[README.md](../../README.md#书签管理端)
- 技术文档：博客 [书签系列](/blog/bookmarks/)（04 认证 · 05 编辑界面 · [06 站点图标](/blog/bookmarks/06-bookmark-logo-design/) · 07 部署）
- Agent 约定：本文；路由见 `.cursor/skills/dev/reference.md`

## 模块范围（模块外）

本站 **无 `src/pages/`**：文档由 Starlight + `src/content/` 生成；书签 URL 由 `integrations/bookmarks-admin.ts` 的 `injectRoute` 注册。

| 路径 | 职责 |
| --- | --- |
| `db/data/bookmarks.ts` | 唯一可提交数据源 |
| `db/config.ts` / `db/seed.ts` | Astro DB 表与 seed |
| `src/bookmarks/nav/entry.astro` | 导航页 Astro 入口（`injectRoute` → `/bookmarks/nav/`） |
| `src/bookmarks/admin/entry.astro` | 管理端 Astro 入口（`injectRoute` → `/bookmarks/admin/`） |
| `integrations/bookmarks-admin.ts` | 注册书签路由 + dev `/admin/api/*` |

## 目录约定

| 层级 | 放什么 |
| --- | --- |
| 模块根（如 `admin/BookmarksAdmin.tsx`） | **仅页面级** React 根 / 壳 |
| `components/<功能>/` | 该表面的 UI 组件（按 editor、dialogs、grid… 分包） |
| `lib/`、`hooks/`、`styles/` | 无 JSX 的逻辑、样式 |

### `nav/`

| 路径 | 职责 |
| --- | --- |
| `NavBookmarksPage.tsx`、`NavBookmarks.tsx` | 页面根 |
| `components/chrome/` | 顶栏、`ui-helpers` |
| `components/cards/` | 书签卡片与分组 |
| `components/sections/` | 模块 Tab、分组面板 |
| `styles/` | 导航页 CSS |

### `admin/`

| 路径 | 职责 |
| --- | --- |
| `BookmarksAdmin.tsx`、`BookmarksAdminApp.tsx` | 页面根 |
| `components/editor/` | 主编辑（见下表） |
| `components/gate/` | 登录门禁 |
| `components/dialogs/` | 弹层 + `AdminDialogLayer`（含 `EditDialog`、`BookmarkEditFields`） |
| `components/grid/` | 卡片网格 |
| `components/transfer/` | 中转站 |
| `components/sections/` | 模块 Tab |
| `components/chrome/` | 顶栏、用户菜单、`ui-helpers` |
| `components/stats/` | 统计与拖拽说明 |

#### `components/editor/`（AdminApp 拆分）

| 文件 | 职责 |
| --- | --- |
| `AdminApp.tsx` | 壳：组合草稿 hook 与子 hook、页面布局 |
| `useAdminTransferStation.ts` | 中转站状态、dock、拖入/拖出 |
| `useAdminGridDrag.ts` | 网格 DnD、`handleDrop` |
| `useAdminEditorActions.ts` | 编辑/保存/离开/删除/导入导出/版本 |
| `AdminAppSectionGrid.tsx` | 模块 Tab 下卡片网格 |
| `AdminAppDialogs.tsx` | 弹层集合 |
| `admin-app-constants.ts` | 中转站动画常量 |
| `components/transfer/TransferStationHeader.tsx` | 顶栏 icon + 标题；`header-meta` 对侧对齐，`header-meta-content` scale 展开 |
| `components/transfer/DragTransferStation.tsx` | 浮层 dock；`data-panel-size-motion` 宽高动画期间隐藏标题；`data-anchor-top` 贴顶 overflow clip |

中转站标题展开：左 dock 标题贴右、右 dock 贴左；面板宽高过渡（240ms）期间隐藏标题，结束后从对侧 scale 淡入。拖拽靠近瞬间展开（`data-panel-instant`）不触发标题延迟。

| `hooks/`、`lib/`、`styles/` | 草稿 hook、API、样式 |
| `hooks/useBookmarkUrlMetadata.ts` | 链接元数据 debounce 识别 |
| `lib/fetch-bookmark-metadata.client.ts` | 客户端解析链路（dev API → 直连 → 代理 → 域名） |
| `lib/admin-api.server.ts` | dev `GET /admin/api/fetch-metadata` |

### `shared/`

跨 nav/admin 的类型、数据、`shared/components/` 展示组件、`shared/styles/`。

| 路径 | 职责 |
| --- | --- |
| `shared/lib/bookmark-url-metadata.ts` | URL 规范化、HTML 元数据合并、域名标题回退 |
| `shared/lib/parse-page-metadata.ts` | 从 HTML 解析 og / twitter / title / description |

### 书签站点图标（Logo.dev）

导航页与管理端共用 `BookmarkFavicon`（网格、中转站、预览）。设计说明见博客 [06 · 书签站点图标](/blog/bookmarks/06-bookmark-logo-design/)。

| 路径 | 职责 |
| --- | --- |
| `shared/components/BookmarkFavicon.tsx` | 懒加载与 Globe 降级 |
| `shared/lib/logo-dev.ts` | Logo.dev URL 参数 |
| `shared/lib/bookmark-logos.ts` | 读 `bookmark-logos.json` |
| `shared/data/bookmark-logos.json` | 构建期 URL→domain 映射 |
| `scripts/generate-bookmark-logos.mjs` | 指纹未变则跳过 |

`PUBLIC_LOGO_DEV_TOKEN`（`.env.example`）；`vpr generate:bookmark-logos` / `vpr build` / admin 保存后更新 JSON。

## 数据流

```text
db/data/bookmarks.ts → seed → Astro DB → getBookmarkSections() → JSON 注水 → React
```

## 对外入口

- `@/bookmarks/nav/NavBookmarksPage`
- `@/bookmarks/admin/BookmarksAdmin`
- `@/bookmarks/shared/data/queries`、`page-data`
