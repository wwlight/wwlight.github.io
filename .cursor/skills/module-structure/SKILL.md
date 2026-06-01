---
name: module-structure
description: Restructures wwlight feature modules (theme, bookmarks) with functional subdirs, module README, per-file headers, route/pages alignment, and mandatory doc/README sync in the same change. Path alias and routing rules live in paths.md only. Use when the user mentions 重构, 结构优化, 目录重组, 迁移, git mv modules, changing routes, or reducing relative imports — read this skill and paths.md before planning or editing.
---

# 模块结构优化

对 `src/theme/`、`src/bookmarks/` 等功能模块做目录梳理时的标准流程。

## Agent 入口（重构 / 优化必先读）

用户提到 **重构、结构优化、目录重组、路由迁移、模块拆分/合并** 时：

1. 用 Read **先读本文**（检查清单、原则、反模式、全局文档同步表）
2. 再读 [paths.md](./paths.md)（alias、pages 路由、例外、书签路由表）
3. 涉及具体模块时再读该模块 `src/<module>/README.md`
4. **理解后再规划** `git mv`、import 修复与文档 grep，不要凭印象改路径
5. **目录动、文档同改**（见下节「目录与文档同步」）——不得只迁代码留 README / 博客 / skill 过期

**路径 alias、路由与 pages 对齐、相对路径例外**：细节只在 [paths.md](./paths.md)，本文不重复。

## 目录与文档同步（硬性规则）

**更新目录结构时，必须在同一轮改动内同步更新文档与 README**，与 `git mv`、import 修复视为一步，不可拆分或延后。

| 优先级 | 文档 | 何时必改 |
| --- | --- | --- |
| P0 | `src/<module>/README.md` | 增删子目录、改分包名、改 pages 入口、改对外 import |
| P0 | [paths.md](./paths.md) | 改 URL、pages 路径、alias 例外 |
| P1 | 根 `README.md` | 项目结构树、pages 路径、模块入口链接 |
| P1 | `.cursor/skills/wwlight-project/SKILL.md` | 目录结构表、模块要点中的路径 |
| P2 | `src/content/docs/blog/<series>/` | 正文含 FileTree、架构图、示例路径或 URL |
| P2 | `src/lib/site-nav.ts`、dev 脚本 `openPaths` | href / prefix / 打开路径 |

**完成标准：** `grep` 旧路径名 / 旧目录名无残留（博客与注释中的真实路径一致）；模块 README 的**目录表**与磁盘一致；必要时 `vpr build` 核对 `dist/` 路由。

**反例：** 只把文件挪进 `src/bookmarks/nav/` 却不改 `README.md` 目录表；路由改了但博客 MDX 仍写旧 URL；skill 里复制 alias 表而不链 paths.md。

## 何时使用

- 单目录文件过多、职责混杂（data / admin / UI 工具混放）
- 缺少模块级 `README.md`，Agent 只能靠 grep 猜架构
- 路由与 `src/pages/` 或实现目录不一致
- 博客、根 README、skill 中的路径与代码不一致

## 检查清单

```text
- [ ] 1. 盘点：glob 模块内文件 + grep 全库引用
- [ ] 2. 划分子目录（按功能，非按文件类型）
- [ ] 3. git mv + 修复 import（跨目录 @/，见 paths.md）
- [ ] 4. 路由：pages 文件路径 ↔ URL 对齐（见 paths.md「路由」）
- [ ] 5. 删除仅做路径转发的 re-export 垫片
- [ ] 6. 各源文件顶部加 /** 功能：… */
- [ ] 7. **同步** `src/<module>/README.md`（目录表、路由、对外 import）— 与步骤 3 同轮完成
- [ ] 8. **同步** 全局文档（见下表 +「目录与文档同步」）— 不得延后
- [ ] 9. grep 旧路径 / 旧目录名，确认 README、博客、skill 无残留
- [ ] 10. vpr lint（必要时 vpr build，核对 dist/ 路由）
```

## 目标结构原则

| 原则 | 说明 |
| --- | --- |
| 功能分包 | 如 `color-mode/`、`shared/`、`nav/`、`admin/`，避免 `utils/` 大杂烩 |
| **路由跟 pages** | `src/pages/<模块>/<表面>.astro` → `/<模块>/<表面>/`，与 `src/<模块>/<表面>/` 实现同名 |
| 根文件 sparingly | 广泛引用的 `types.ts` 或 `index.ts` 放子目录根 |
| 生成物分离 | 手写与 `vpr generate:*` 产出分目录，README 标明勿手改 |
| 组件与 lib 分工 | lib 无 JSX；React 留在 `components/` |
| **路径** | alias / 少相对路径 → [paths.md](./paths.md) |

## 文件头模板

```ts
/**
 * 功能：一句话职责。
 * 关联：可选，主要调用方或依赖路径。
 */
```

单行足够时用 `/** 功能描述 */`。

## 模块 README 模板

参照 [`src/theme/README.md`](../../../src/theme/README.md) 与 [`src/bookmarks/README.md`](../../../src/bookmarks/README.md)：

1. 标题 + 一两句范围
2. 链接：根 README、wwlight skill、[paths.md](./paths.md)
3. **模块范围**表（pages / db / integrations）
4. **目录**表（子文件夹职责）
5. **路由**表（一行）+「详见 paths.md」
6. 数据流、已知限制、对外 import

skill 里只保留速查 + 链接，不重复完整目录表或 alias 表。

## 全局文档同步

改模块路径或路由后 **grep 模块名**，至少检查下表（完整优先级见上文 **目录与文档同步**）：

| 位置 | 动作 |
| --- | --- |
| [paths.md](./paths.md) | 路由表 / alias 例外有变则更新 |
| `src/<module>/README.md` | 目录表、路由、对外 import |
| 根 `README.md` | 项目结构树 + pages 路径 |
| `.cursor/skills/wwlight-project/SKILL.md` | 目录结构表、书签要点 |
| `.cursor/rules/wwlight-project.mdc` | 若约定「改 X 前先读 Y」 |
| `src/content/docs/blog/<series>/` | FileTree、架构图、示例 URL |
| `src/lib/site-nav.ts` 等 | href / prefix |

### 博客同步注意

遵守 wwlight skill **博客（技术笔记）**：真实路径、无教程体；删手动文章索引与「本章小结」。

## 反模式

- 移动文件后留 orphan re-export
- skill / README / paths.md **三处各写一份 alias 表**（只维护 paths.md）
- URL 与 pages 文件名不一致（如 `/nav/bookmarks/` 配 `pages/bookmarks/nav.astro`）
- 深层 `../../../`（见 paths.md 例外表）
- 只改代码不 grep 文档与 dev 脚本
- **目录已变、README / 博客 / skill 仍写旧结构**（文档与代码必须同 PR / 同轮对话落地）

## 参考实例

| 模块 | README | 分包 | 路由 |
| --- | --- | --- | --- |
| 主题 | `src/theme/README.md` | `color-mode/`、`customizer/`、… | Starlight 内，无独立 pages 子树 |
| 书签 | `src/bookmarks/README.md` | `shared/`、`nav/`、`admin/` | `pages/bookmarks/{nav,admin}.astro` → [paths.md](./paths.md) |
