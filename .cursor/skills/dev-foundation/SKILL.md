---
name: dev-foundation
description: Public dev foundation—technical writing, module restructuring, paths patterns; sub-files tailwindcss.md, vite-plus.md, paths.md. Use for 重构, git mv, blog MDX, className, vp/vpr. Project-specific paths and scripts live in that repo's project skill.
---

# 开发基础

跨项目通用的开发约定与文档技能。**具体路径、脚本表、框架接入**写在各仓库 **project skill**（如 `wwlight-project`），子文件只写可复用规则。

## 技能文件

| 文件 | 何时读 |
| --- | --- |
| [tailwindcss.md](./tailwindcss.md) | 写 / 审 `className`、`@apply`、`@theme`，迁移方括号类名 |
| [vite-plus.md](./vite-plus.md) | 安装依赖、`vpr` 跑脚本、pnpm catalog 通用约定 |
| [paths.md](./paths.md) | path alias、路由维护模式（非具体 URL） |

## 角色设定

你是**高级资深软件设计与开发工程师**，负责**当前项目**的架构梳理、文档质量与落地：

- **设计**：按职责划分子目录与边界，路由与 `pages` 对齐，控制耦合与重复
- **开发**：`git mv`、import 与 alias 修复、最小必要改动，不引入过度抽象
- **文档**：实现说明可核对；结构变更与 README / 项目文档 **同轮同步**
- **验证**：grep 旧路径、跑项目 lint/build，以可验证结果收束

## Agent 入口

| 场景 | 先读 |
| --- | --- |
| **写 / 改技术文档、博客 MDX** | 下文 **技术说明写法** |
| **重构、结构优化、目录重组、路由迁移** | 下文 **目录与文档同步** 起至文末 + 本项目 skill **paths.md** |
| **Tailwind / className** | [tailwindcss.md](./tailwindcss.md) + 项目 skill Tailwind 接入 |
| **安装、脚本、依赖** | [vite-plus.md](./vite-plus.md) + 项目 skill 命令速查 |
| 涉及具体模块 | 该模块 `src/<module>/README.md`（或项目约定路径） |

---

## 技术说明写法

技术笔记、架构说明、系列博客：**按仓库真实路径与机制写**，不是教程体、宣传体。

### 写什么（可核对）

- **具体路径**：源码目录、配置文件、数据文件 — 用 FileTree / 表格 / 代码块
- **机制**：数据流、调用链、配置项含义；需要时链官方文档
- **项目取舍**：为何用某文件、某 API、某约束（部署、环境限制等）
- **图示**：流程/结构图优先于空泛段落
- 系列索引页：**范围**（技术要点列表）→ **架构**（可选）→ **文章列表**

### 不要写什么（禁止套话）

- 「从 0 到 1」「不是抽象讲概念」「你会学到什么」「建议按顺序阅读」「怎么读」
- 解释「为何把 A 和 B 分目录」之类元叙述（目录结构在 skill / README 约定即可，正文不重复说教）
- 「业务 / 壳层」「高大上」概括代替实现细节
- 「系列完结」「若你要在此基础上…」等教程收尾、展望口语
- 正文手动「上一篇 / 下一篇」链接（用文档站 prev/next 或侧栏即可）
- 与实现无关的「前置要求」「快速体验」长段（命令一行带过即可，且仅当该篇主题需要）

### 文风

- 句子短、陈述事实；用「`路径` 负责 …」而不是「带你走进 …」
- 标题用序号 + 主题 + `description` 一句话技术摘要
- Q&A、延伸仅保留**可落地的技术选项**，不写鼓动性结语

框架专属格式（如 Starlight MDX 指令、组件名）写在**该项目 skill**，不在本文假设。

---

## 目录与文档同步（硬性规则）

**更新目录结构时，必须在同一轮改动内同步更新文档与 README**，与 `git mv`、import 修复视为一步，不可拆分或延后。

| 优先级 | 文档 | 何时必改 |
| --- | --- | --- |
| P0 | 项目 skill 的 **paths.md**（若有） | 改 URL、pages、alias 例外 |
| P0 | `src/<module>/README.md` | 增删子目录、改 pages 入口、改对外 import |
| P1 | 根 `README.md` | 项目结构树、pages 路径 |
| P1 | **本项目 skill** | 目录表、模块要点 |
| P2 | 项目内技术文档 / 博客 | FileTree、架构图、示例路径或 URL |
| P2 | 导航配置、dev 脚本 | href / prefix / openPaths 等 |

**完成标准：** grep 旧路径无残留；模块 README **目录表**与磁盘一致；必要时 build 核对产物路由。

## 何时使用（结构优化）

- 单目录文件过多、职责混杂
- 缺少模块级 `README.md`
- 路由与 `pages/` 或实现目录不一致
- 文档与代码路径不一致

## 检查清单

```text
- [ ] 1. 盘点：glob 模块内文件 + grep 全库引用
- [ ] 2. 划分子目录（按功能，非按文件类型）
- [ ] 3. git mv + 修复 import（遵循项目 paths.md 的 alias 约定）
- [ ] 4. 路由：pages 文件路径 ↔ URL 对齐
- [ ] 5. 删除仅做路径转发的 re-export 垫片
- [ ] 6. 各源文件顶部加 /** 功能：… */（若项目要求）
- [ ] 7. 同步 src/<module>/README.md — 与步骤 3 同轮
- [ ] 8. 同步项目 skill、paths.md、根 README、相关文档
- [ ] 9. grep 旧路径 / 旧目录名
- [ ] 10. lint / build（按项目脚本，见 vite-plus.md）
```

## 目标结构原则

| 原则 | 说明 |
| --- | --- |
| 功能分包 | `shared/`、`admin/`、`nav/` 等按职责，避免大杂烩 `utils/` |
| **路由跟 pages** | 框架约定下 pages 路径与 URL 一致；实现目录与表面对齐 |
| 根文件 sparingly | 广泛引用的 `types.ts` / `index.ts` 放子目录根 |
| 生成物分离 | 手写与 codegen 产出分目录，README 标明勿手改 |
| 组件与 lib 分工 | lib 无 JSX；UI 留在 `components/` |
| **路径** | alias 与例外只在项目 **paths.md** 维护一份 |

## 文件头模板

```ts
/**
 * 功能：一句话职责。
 * 关联：可选，主要调用方或依赖路径。
 */
```

## 模块 README 模板

1. 标题 + 范围
2. 链接：根 README、项目 skill、paths.md
3. **模块范围**表（pages / 外部依赖）
4. **目录**表
5. **路由**一行 + 指向 paths.md
6. 数据流、限制、对外 import

项目 skill 只保留速查 + 链接，不重复完整目录表或 alias 表。

## 反模式

- 移动文件后留 orphan re-export
- 多处各写一份 alias 表（只维护项目 paths.md）
- URL 与 pages 文件名不一致
- 深层相对 import（无 paths.md 例外）
- 只改代码不 grep 文档
- **目录已变、文档仍写旧结构**
- 技术文档写教程套话、元叙述代替实现路径
- 裸跑 `pnpm` / `npm` 而不用 `vp` / `vpr`（见 vite-plus.md）
