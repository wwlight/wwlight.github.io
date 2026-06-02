---
name: dev-foundation
description: 重构、文档写法、Tailwind、vp/vpr、图标。具体路径/脚本见各仓库 project skill。
---

# 开发基础

通用约定；**alias 表、脚本表、框架接入**只在 project skill（如 `wwlight-project`）。

## 子文件

| 文件 | 何时读 |
| --- | --- |
| [tailwindcss.md](./tailwindcss.md) | className / `@apply` |
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

## 反模式

orphan re-export；多处 alias 表；URL≠pages；只改代码不 grep 文档；裸 `pnpm install`；库有 icon 仍手绘/叠拼。
