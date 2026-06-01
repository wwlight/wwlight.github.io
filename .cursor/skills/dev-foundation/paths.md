# 路径与路由（通用模式）

本文说明**任意项目**应如何集中维护 path alias 与路由；**具体映射表**只写在**该项目 skill** 的 `paths.md`。

## 维护原则

| 规则 | 说明 |
| --- | --- |
| **一处维护** | alias、pages 路由、例外 — 仅项目 `paths.md` |
| **skill 只链接** | 通用 skill（dev-foundation 子文件、模块 README）不复制映射表 |
| **重构同轮** | 改目录 / URL 时同步改项目 paths.md 与相关文档 |

## Path alias（模式）

| 项 | 典型做法 |
| --- | --- |
| 配置源 | `tsconfig.json` paths + 构建工具 `tsconfigPaths`（或框架等价项） |
| 跨目录 | 优先 path alias（如 `@/` → `src/`） |
| 同目录 | `./` 相对引用 |
| 例外 | 配置加载链、repo 根目录脚本等 — 列入项目 paths.md **例外表** |

## 路由（模式）

- **文件路由框架**（如 Astro）：`pages/` 下路径 ↔ URL 通常一致
- **实现目录**：`src/<module>/<surface>/` 与 `pages/<module>/<surface>` 同名对齐
- **改路由**：先 `git mv` pages，再 grep 全库 href、redirect、文档

## 重构后检查（通用）

```text
- [ ] pages 与目标 URL 一致
- [ ] 项目 paths.md 已更新
- [ ] 模块 README 目录表已更新
- [ ] grep 旧路径（含文档、注释）
- [ ] grep 多余相对 import（除 paths 例外表）
- [ ] build 产物路由与预期一致（若适用）
```

重构流程见 [SKILL.md](./SKILL.md)。
