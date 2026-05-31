---
name: knowledge-notes
description: Curated knowledge reference for syntax, conventions, and quick facts. Use when the user asks about a saved topic, when writing docs/README, or when a task matches an indexed note below.
---

# 知识点备忘

本 skill 存放可复用的**知识点**，供 Agent 按需查阅。每个主题一个独立文件，避免 SKILL.md 膨胀。

## 使用方式

1. 根据下方索引判断是否有相关主题
2. 有则 **Read** 对应文件后再回答或改代码
3. 无则按常规定式处理；用户要求时可新增主题文件并更新本索引

## 新增主题

在 `.cursor/skills/knowledge-notes/` 下新建 `{slug}.md`：

- 文件名：小写、连字符，与主题 slug 一致
- 结构：标题 → 语法/定义 → 示例 → 选用建议（可选）→ 与本仓库关系（若相关）
- 在本文件「索引」表增加一行

## 索引

| 主题 | 文件 | 何时查阅 |
| --- | --- | --- |
| GitHub Alerts（callouts / admonitions） | [github-alerts.md](github-alerts.md) | 写 GFM callout、`[!NOTE]` 等 blockquote 提示框，或用户提到 admonitions / GitHub Alerts |
