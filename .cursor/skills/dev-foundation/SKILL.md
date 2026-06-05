---
name: dev-foundation
description: 重构、文档写法、Tailwind、vp/vpr、图标。具体路径/脚本见各仓库 project skill。
---

# 开发基础

通用约定；**alias 表、脚本表、框架接入**只在 project skill（如 `wwlight-project`）。

## 勿改（记录）

以下路径 **禁止 Agent 编辑**；仓库级约定只写本 skill / project skill，勿改源文件：

| 路径 | 说明 |
| --- | --- |
| `.cursor/skills/karpathy-guidelines/` | 行为准则源稿 |
| `.cursor/rules/karpathy-guidelines.mdc` | 同上，alwaysApply |
| `.cursor/skills/frontend-design/` | 前端设计 skill |

## 子文件

| 文件 | 何时读 |
| --- | --- |
| [tailwindcss.md](./tailwindcss.md) | className / `@apply`（**按 v4 最新要求**，含 `bg-linear-to-*` 等） |
| [vite-plus.md](./vite-plus.md) | `vp i`、`vpr`、catalog |
| [paths.md](./paths.md) | 路径维护模式（具体表 → project skill **路径/路由**） |

## Icon

优先 **Lucide**（`lucide-react`）。顺序：单组件 → 库内 `-cog` 等复合 → 单 SVG 抄官方 path。**避免**两 icon 叠拼、手绘杂糅 SVG。共用抽到 `shared/components/`。装饰 `aria-hidden`；仅图标按钮 `aria-label`。

## 技术说明（博客 / 架构 MDX）

**写**：真实路径、数据流、配置含义、FileTree/表/图。**禁**：教程套话（「从 0 到 1」「建议按顺序读」）、元叙述、与实现无关的长段。

框架格式（Starlight `:::note` 等）→ project skill。

## 目录与文档（硬性）

改目录 **同轮** 同步文档：

| P | 文档 |
| --- | --- |
| P0 | project skill 路径/路由；`src/<module>/README.md` |
| P1 | 根 README；project skill |
| P2 | 博客/技术 MDX；导航配置 |

完成：grep 旧路径；`vpr lint` / `vpr build`。

## 重构清单

```text
glob + grep 引用 → 划分子目录 → git mv → 修 import（@/）
pages ↔ URL → 删 re-export 垫片 → 同步 README/skill
grep 旧路径 → lint/build
```

原则：功能分包；路由跟 `pages/`；alias/URL 只维护 project skill 一处；lib 无 JSX。

## 源文件体量

单文件过大难读难改；**新建或大改**时遵守：

| 类型 | 建议上限 | 超出则 |
| --- | --- | --- |
| 组件 / hook / lib（`.tsx`、`.ts`） | ~**400 行** | 按功能拆到同目录子文件（hook、子组件、constants） |
| 页面壳 / 组合根 | ~**300 行** | 逻辑下沉 hook，UI 拆子组件 |

**顶注释**（每个源文件）：

```ts
/**
 * 功能：…
 * 关联：…
 */
```

Agent 先读顶注释定位职责；拆分后同轮更新 `src/<module>/README.md` 与 project skill 文件表。

**勿**：为拆而拆（单用途 <200 行可保持）；拆出 orphan 垫片 re-export（见反模式）。

## Git commit

- **默认不 commit**；仅用户明确说 commit / 提交时执行
- **仅一行 subject**，不写 body、备注、空行续段
- 格式：`type(scope): 简述`（与仓库 `git log` 近期风格一致）；一句说清 why
- 不主动 push、amend、force push（除非用户明确要求）；勿 `--no-verify`；hook 改文件则新 commit，勿擅自 amend

## 反模式

- orphan re-export；多处 alias 表；URL≠pages；只改代码不 grep 文档；裸 `pnpm install`；库有 icon 仍手绘/叠拼
- **弹层/蒙层锁背景滚动**：未先查仓库就写 `body position:fixed + scrollY + paddingRight + scrollTo` 教程大包。应先确认：① 谁在滚（`html` / 容器）；② 是否已有 `scrollbar-gutter: stable`（`scrollbars.css`）；③ Radix Dialog 等是否自带 `react-remove-scroll`。wwlight 书签/管理端多为 document 滚动 + 全站 gutter stable → 通常 `html { overflow: hidden }`（类名 `admin-dialog-scroll-lock`，见 `admin.css` + `AdminDialogLayer`）即可，不必 `scrollTo`、不必抵滚动条宽度。`color-mode.ts` 的 `fixed body` 是为 **View Transition 快照**，与弹层锁滚动目的不同，勿照搬。仍漏滚再考虑库或定点重方案，并说明原因。

其它：Radix 已锁时勿重复叠一层自建锁，先测能否只依赖 Dialog。
