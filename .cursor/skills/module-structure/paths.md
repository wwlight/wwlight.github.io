# 路径与路由约定（本仓库唯一说明处）

Agent 与重构时 **只在这里查 alias / 路由规则**；`module-structure/SKILL.md`、各模块 README 只链到本文，不重复展开。

**重构 / 结构优化**：先读 [SKILL.md](./SKILL.md) 全文，再读本文；勿只读 alias 表就动手改路径。

## Path alias

配置源（勿在别处再写一套映射表）：

| 文件 | 作用 |
| --- | --- |
| [`tsconfig.json`](../../../tsconfig.json) | `"@/*": ["src/*"]`，`baseUrl: "."` |
| [`astro.config.mjs`](../../../astro.config.mjs) | `vite.resolve.tsconfigPaths: true` — TS 与 **CSS `@import`** 均解析 `@/` |

### 用法

| 规则 | 说明 |
| --- | --- |
| **`@/` = `src/` 根** | `@/bookmarks/nav/...`、`@/theme/...`、`@/styles/...` |
| **跨目录一律 `@/`** | TS / TSX / Astro / CSS 模块间引用不用 `../../` |
| **仅同目录 `./`** | 同文件夹内 CSS/TS，如 `@import './bookmarks-nav-tokens.css'` |
| **grep 收尾** | `from ['\"]\.\./`、`@import ['\"]\.\./`，能改则改 |

### 例外（允许相对路径）

| 场景 | 原因 | 示例 |
| --- | --- | --- |
| `integrations/` 在 `astro.config` 加载链中 import 的 server 文件 | 配置阶段 Vite 可能尚未解析 `@/` | `admin-api.server.ts` → `../../shared/data/serialize` |
| `integrations/` → `src/` | 无 `@/` 时用最短相对路径 | `../src/bookmarks/admin/lib/admin-api.server.ts` |
| `db/`、`scripts/`（repo 根） | 不在 `src/`，无 `@/` | 按实际位置写相对路径 |

新增例外时 **只改本节表格**，不要在 skill 正文复制。

## 路由 = `src/pages/` 文件路径

Astro 文件路由：**URL 路径与 `src/pages/` 下文件路径一致**（目录 + 文件名，不含 `src/pages`、不含扩展名）。

```text
src/pages/bookmarks/nav.astro    →  /bookmarks/nav/
src/pages/bookmarks/admin.astro  →  /bookmarks/admin/
```

与实现目录对齐（书签模块）：

```text
src/bookmarks/nav/     … 导航页实现
src/bookmarks/admin/   … 管理端实现
src/bookmarks/shared/  … 共用
```

**约定：** `pages/<模块>/<表面>.astro` 对应 `/模块/表面/`；改路由先 `git mv` pages 文件，再 grep 全库 href / `prefix` / dev 脚本 / 博客。

### 本书签模块路由表

| URL | 页面入口 | 实现 |
| --- | --- | --- |
| `/bookmarks/nav/` | `src/pages/bookmarks/nav.astro` | `src/bookmarks/nav/` |
| `/bookmarks/admin/` | `src/pages/bookmarks/admin.astro` | `src/bookmarks/admin/` |

**旧 URL 重定向**（`astro.config.mjs` → `redirects`，301）：

| 旧路径 | 新路径 |
| --- | --- |
| `/bookmarks`、`/bookmarks/` | `/bookmarks/nav/` |

配置于 `astro.config.mjs` → `redirects`（无尾斜杠键即可，Astro 同时覆盖尾斜杠变体）。**不**为 `/admin/bookmarks/` 做重定向（与 dev API `/admin/api/*` 路径前缀无关，旧书签管理 URL 直接废弃）。

**不属于 pages 路由、勿与上表混淆：**

| 路径 | 说明 |
| --- | --- |
| `/admin/api/*` | dev 中间件 API（`integrations/bookmarks-admin.ts`），与 `/bookmarks/admin/` 页面无关 |
| `/blog/bookmarks/*` | Starlight 文档系列，不是书签 App |

站点链接（改路由必同步）：

| 用途 | 文件 |
| --- | --- |
| 顶栏书签 | `src/lib/site-nav.ts` → `bookmarksNavItem` |
| 首页 CTA | `src/content/docs/index.mdx` |
| 管理端返回导航 | `NavPageActions`、`BookmarksAdminApp`、`AdminApp` 内 href |

## 重构后检查

```text
- [ ] pages 文件路径与目标 URL 一致
- [ ] grep `/bookmarks/`、`site-nav`、`openPaths`（dev 脚本）
- [ ] grep `from '../`、`@import '../`（除 paths.md 例外表）
- [ ] 模块 README 目录表 + 链到本文（与 git mv **同轮**更新，见 SKILL.md「目录与文档同步」）
- [ ] grep 根 README、wwlight skill、博客 MDX 旧路径
- [ ] vpr build → dist/ 下目录与 URL 一致
```
