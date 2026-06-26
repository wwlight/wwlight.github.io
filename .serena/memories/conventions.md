# 编码规范

## Imports

- `@/*` → `src/*`（tsconfigPaths）。跨目录 `@/`，同目录 `./`。`db/`、`scripts/`、`integrations/` 不用 `@/`。
- 改路由同步 `site-nav.ts`、导航 MDX、NavPageActions、BookmarksAdminApp。

## Tailwind v4

- scale: `p-1`、`min-h-15`，不用 `p-[1]`、`min-h-[60px]`
- CSS 变量: `bg-(--primary)`，不用 `bg-[var(--primary)]`
- data: `data-state-open:`、`group-data-state-open:`，不用 `data-[state=open]:`
- 渐变: `bg-linear-to-*`，不用 `bg-gradient-to-*`
- 方括号保留: `color-mix`、`calc()`、复杂 `shadow-[...]`
- 重复 ≥3 次的 utility → `src/styles/tailwind-utilities.css` `@utility`
- 校验: `rg 'bg-gradient-to-'` 查遗留 v3

## 组件

- React 岛: `client:only="react"`
- 组件/hook ≤400 行、页面壳 ≤300 行；超出按功能拆
- 源文件顶注释 `功能 / 关联`
- BackToTop 操作 `document.body`
- `src/bookmarks/` 组件按功能分子目录（editor、dialogs、grid…）

## 滚动

- `html` 有 `scrollbar-gutter: stable`
- 滚动区: `app-scrollbar` + `min-h-0`
- 弹层锁滚动: 先查谁在滚、`scrollbar-gutter`、Radix 是否已锁
- 本站: `html { overflow: hidden }`（`admin-dialog-scroll-lock`、`AdminDialogLayer`）
- 勿 `body fixed + scrollTo`（`color-mode.ts` 的 `fixed body` 仅 View Transition）
- Radix Dialog 已锁时勿再叠自建锁

## Starlight / Mermaid

- `mermaid({ autoTheme: true })`；flowchart 含 `?` 须引号: `B{"DEV?"}`
- `integrations/mermaid-controls.ts`
- redirect 同路径只写一条，双写 `[router]` collision

## 主题

- 默认 green/slate/0.25/system。`.bookmark-card` 勿 `border-border/50`。
- `PUBLIC_BOOKMARKS_ADMIN_HASH` — 管理端认证。详见 `src/bookmarks/README.md`。

## Blog MDX

- 系列: `blog/bookmarks|astro|theme|ai/`
- 技术文: 真实路径与数据流，禁教程套话
- Alert: `[!NOTE]` 五种全大写；标题与类型同行；正文下一行 `>` 起

## 重构

`glob` → `git mv` → 修 `@/` import → 删 orphan re-export → 同步模块 README → `vpr lint` / `vpr build`

## 反模式

- 多处 alias 表；只改代码不 grep 文档
- Lucide 可用手绘/叠拼 icon，不引入新 icon 库