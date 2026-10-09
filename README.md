# wwlight

个人文档站：书签、AI 使用记录与开发笔记。

线上地址：

- [wwlight.netlify.app](https://wwlight.netlify.app)、[wwlight.vercel.app](https://wwlight.vercel.app)：当前主仓库
- [wwlight.github.io](https://wwlight.github.io)：旧版 Astro 站点

## 内容

| 栏目      | 路径         | 说明                                   |
| --------- | ------------ | -------------------------------------- |
| Bookmarks | `/bookmarks` | 工具、开发、学习、媒体、设计等分类书签 |
| AI        | `/ai`        | Agent 工具与 AI 工作流的使用记录       |
| Guides    | `/guides`    | 开发笔记、系统软件与其它实用记录       |

## 本地开发

```bash
pnpm install
git submodule update --init
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

- `modules/font-subset`：中文与等宽字体子集放在子模块 `font-subset`（同一仓库的 `font-subset` 分支），站点从 `/font-subset` 提供。改字库后执行 `pnpm fonts`，再在主仓库提交子模块的新提交号
- 明暗主题与强调色切换
- 小鹤双拼键位图（`app/components/flypy`）
