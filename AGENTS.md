# AGENTS.md

Astro 7 + Starlight 文档站，React 书签管理模块，部署到 GitHub Pages（+ Vercel / Netlify 镜像）。

## 项目结构

```
src/
├── content/docs/          # Markdown 文档（blog, memorandum, tools, system, other）
├── bookmarks/             # 书签导航 + 管理端（React 岛）
├── components/            # 共享 Astro/React 组件
├── theme/                 # 主题系统（配色、token 生成）
├── styles/                # 全局 CSS（Tailwind v4 入口）
└── lib/                   # 工具函数
db/                        # Astro DB 表定义 + seed 数据
integrations/              # 自定义 Astro 集成（bookmarks-admin, mermaid-controls）
scripts/                   # 构建/生成脚本
```

路由由 Starlight + `injectRoute` 注册，无 `src/pages/`。`@/*` → `src/*`。`db/`、`scripts/`、`integrations/` 不用 `@/`。

## 运行命令

Shell 命令请始终用 `rtk` 前缀以减少 token 消耗。

```bash
rtk vpr dev              # 开发 :4321
rtk vpr dev:all          # 开发 + 同时打开主站和管理端
rtk vpr build            # 生成 logo 缓存 → astro build
rtk vpr lint             # ESLint 检查
rtk vpr lint:fix         # ESLint 自动修复
rtk vp i                 # 安装依赖（不是 pnpm install）
rtk vp add <pkg>         # 添加依赖（不是 pnpm add）
```

依赖版本统一在 `pnpm-workspace.yaml` 的 `catalogs` 中管理，`package.json` 使用 `catalog:` 引用。不要直接改 `package.json` 里的版本号。

## 测试

**本项目无测试框架。** 完成修改后必须通过 `vpr build` 验证，该命令会执行：
1. `generate-bookmark-logos` 生成缓存
2. `astro build` 完整构建

## 代码风格

### Imports
- 跨目录用 `@/`，同目录用 `./`
- 改路由时同步 `lib/site-nav.ts` 和相关 MDX 文件

### Tailwind v4
- 用内置 scale：`p-1`、`min-h-15`，不用 `p-[1]`、`min-h-[60px]`
- CSS 变量：`bg-(--primary)`，不用 `bg-[var(--primary)]`
- data 属性：`data-state-open:`、`group-data-state-open:`，不用 `data-[state=open]:`
- 渐变：`bg-linear-to-*`，不用 `bg-gradient-to-*`
- 方括号仅保留：`color-mix`、`calc()`、复杂 `shadow-[...]`
- 重复 ≥3 次的 utility 组合提取到 `src/styles/tailwind-utilities.css` 用 `@utility`

### 组件
- React 交互组件必须 `client:only="react"`
- 组件/hook ≤400 行，页面壳 ≤300 行，超出按功能拆分子目录
- 用 Lucide 图标，可手绘/叠拼，不引入新图标库

### Git Commit
格式：`type(scope): summary`（中文 summary）

常用 type：`feat` `fix` `docs` `refactor` `chore`

常用 scope：`bookmarks` `theme` `blog` `tools` `ai` `cursor`

### ESLint
使用 `@antfu/eslint-config` 扁平配置，`eslint-plugin-format` 负责格式化（无 Prettier）。pre-commit 自动 lint-staged。

## 禁止事项

| 禁止 | 原因 |
|------|------|
| `bg-gradient-to-*` | Tailwind v4 用 `bg-linear-to-*` |
| `data-[state=open]:` | v4 用 `data-state-open:` |
| `bg-[var(--...)]` | v4 用 `bg-(--...)` |
| 引入新图标库 | 只用 Lucide |
| `body { fixed } + scrollTo` 锁滚动 | 用 `html { overflow: hidden }` + `app-scrollbar` |
| Radix Dialog 已锁时再叠自建锁 | 信任 Radix 的锁 |
| 同一路径写多条 redirect | `[router]` collision |
| `mermaid()` 放在 `starlight()` 之后 | 必须在之前 |
| 直接改 `package.json` 版本号 | 改 `pnpm-workspace.yaml` catalog |
| 遗留 >400 行新组件 | 拆分子组件 |

## 完成标准

1. `vpr lint` 通过，无报错
2. `vpr build` 成功，无警告
3. 改路由时确认 `lib/site-nav.ts`、导航 MDX、BookmarksAdminApp 已同步
4. 改模块时同步模块自己的 README（`src/bookmarks/README.md`、`src/theme/README.md`）

## Review 标准

- [ ] Tailwind 是否全部 v4 语法（`rg 'bg-gradient-to-'` 无匹配）
- [ ] 是否使用了 `@/` 而非深层相对路径做跨目录引用
- [ ] React 组件是否有 `client:only="react"`
- [ ] 新组件是否 ≤400 行
- [ ] 是否引入了新的依赖（如是，检查是否在 catalog 中）
- [ ] 是否修改了路由（如是，检查相关文件是否同步）
