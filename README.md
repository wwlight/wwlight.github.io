# wwlight

个人文档站：书签、AI 使用记录与开发笔记。线上地址 [wwlight.github.io](https://wwlight.github.io)。

## 内容

| 栏目 | 路径 | 说明 |
| --- | --- | --- |
| Bookmarks | `/bookmarks` | 工具、开发、学习、媒体、设计等分类书签 |
| AI | `/ai` | Agent 工具与 AI 工作流的使用记录 |
| Guides | `/guides` | 开发笔记、系统软件与其它实用记录 |

## 本地开发

使用 [pnpm](https://pnpm.io/) 11.22。

```bash
pnpm install
pnpm dev
```

开发服务器默认在 `http://localhost:3000`。

```bash
pnpm build    # 生产构建，输出到 .output
pnpm preview  # 预览构建结果
```

## 技术栈

- [Nuxt 4](https://nuxt.com) 与 [Docus](https://docus.dev)
- [Nuxt Content](https://content.nuxt.com/)
- [Nuxt UI](https://ui.nuxt.com) 与 Tailwind CSS 4
- [Nuxt Studio](https://nuxt.studio)（后台路径 `/admin`）

站点里还有这些部分：

- `modules/font-subset`：构建时用 cn-font-split 按页面用字生成中文与等宽字体子集，发布到 `/font-subset`
- 明暗主题与强调色切换
- 小鹤双拼键位图（`app/components/flypy`）

## 部署

`netlify.toml` 为字体子集设置缓存：`.woff2` 长期缓存，`family.css` 每次再验证。
