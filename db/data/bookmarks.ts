// 书签数据源 — 在此文件维护书签，保存后 dev 会自动重新 seed
// 从旧 MDX 批量导入: node scripts/migrate-bookmarks.mjs <path-to.mdx>

export interface BookmarkLink {
  title: string
  url: string
}

export interface BookmarkData {
  title: string
  url: string
  description?: string
  badgeText?: string
  badgeVariant?: string
  extraLinks?: BookmarkLink[]
  sortOrder: number
}

export interface BookmarkCardData {
  title: string
  sortOrder: number
  bookmarks: BookmarkData[]
}

export interface BookmarkSectionData {
  title: string
  sortOrder: number
  stagger: boolean
  cards: BookmarkCardData[]
}

export const bookmarkSections: BookmarkSectionData[] = [
  {
    "title": "工具相关",
    "sortOrder": 0,
    "stagger": true,
    "cards": [
      {
        "title": "常用",
        "sortOrder": 0,
        "bookmarks": [
          {
            "title": "tldr",
            "url": "https://tldr.inbrowser.app/",
            "sortOrder": 0,
            "description": "在线命令速查表"
          },
          {
            "title": "JSONT",
            "url": "https://www.jsont.run/",
            "sortOrder": 1,
            "description": "JSON 格式化工具"
          },
          {
            "title": "TinyPNG",
            "url": "https://tinypng.com/",
            "sortOrder": 2,
            "description": "图像压缩"
          },
          {
            "title": "Screego",
            "url": "https://screego.net/",
            "sortOrder": 3,
            "description": "屏幕共享",
            "extraLinks": [
              {
                "title": "在线地址",
                "url": "https://app.screego.net/"
              }
            ]
          },
          {
            "title": "Cobalt",
            "url": "https://cobalt.tools/",
            "sortOrder": 4,
            "description": "下载工具"
          },
          {
            "title": "Dub",
            "url": "https://dub.co/",
            "sortOrder": 5,
            "description": "开源短链接服务管理工具"
          },
          {
            "title": "Ray.so",
            "url": "https://ray.so/",
            "sortOrder": 6,
            "description": "生成代码片段图"
          }
        ]
      },
      {
        "title": "开发指南",
        "sortOrder": 1,
        "bookmarks": [
          {
            "title": "CheatSheets",
            "url": "https://cheatsheets.zip/",
            "sortOrder": 0
          },
          {
            "title": "Roadmap",
            "url": "https://roadmap.sh/",
            "sortOrder": 1
          },
          {
            "title": "Patterns",
            "url": "https://www.patterns.dev/",
            "sortOrder": 2
          },
          {
            "title": "Component Party",
            "url": "https://component-party.dev/",
            "sortOrder": 3
          },
          {
            "title": "前端学习路线",
            "url": "https://objtube.github.io/front-end-roadmap",
            "sortOrder": 4
          }
        ]
      },
      {
        "title": "字体",
        "sortOrder": 2,
        "bookmarks": [
          {
            "title": "FiraCode",
            "url": "https://github.com/tonsky/FiraCode",
            "sortOrder": 0,
            "description": "免费的编程连字等宽字体"
          },
          {
            "title": "Monaspace",
            "url": "https://monaspace.githubnext.com/",
            "sortOrder": 1
          },
          {
            "title": "Maple Mono",
            "url": "https://font.subf.dev/",
            "sortOrder": 2
          },
          {
            "title": "LxgwWenKai",
            "url": "https://github.com/lxgw/LxgwWenKai",
            "sortOrder": 3,
            "description": "霞鹜文楷"
          }
        ]
      },
      {
        "title": "字体库",
        "sortOrder": 3,
        "bookmarks": [
          {
            "title": "Googles Fonts",
            "url": "https://fonts.google.com/",
            "sortOrder": 0
          },
          {
            "title": "Nerd Fonts",
            "url": "https://www.nerdfonts.com/",
            "sortOrder": 1,
            "description": "超丰富字体符号补丁工具"
          },
          {
            "title": "Bunny",
            "url": "https://fonts.bunny.net/",
            "sortOrder": 2
          },
          {
            "title": "Fontshare",
            "url": "https://www.fontshare.com/",
            "sortOrder": 3
          },
          {
            "title": "100font.com",
            "url": "https://www.100font.com/",
            "sortOrder": 4,
            "description": "免费商用字体网站"
          },
          {
            "title": "Fontspace",
            "url": "https://www.fontspace.com/",
            "sortOrder": 5
          },
          {
            "title": "Dafont.com",
            "url": "https://www.dafont.com/",
            "sortOrder": 6
          }
        ]
      },
      {
        "title": "构建文档",
        "sortOrder": 4,
        "bookmarks": [
          {
            "title": "Jamstack",
            "url": "https://jamstack.org/generators/",
            "sortOrder": 0,
            "description": "现代化的网站开发架构"
          },
          {
            "title": "Starlight",
            "url": "https://starlight.astro.build/",
            "sortOrder": 1
          },
          {
            "title": "NuxtContent",
            "url": "https://content.nuxtjs.org/",
            "sortOrder": 2
          },
          {
            "title": "Docus",
            "url": "https://docus.dev/",
            "sortOrder": 3
          },
          {
            "title": "Docusaurus",
            "url": "https://docusaurus.io/",
            "sortOrder": 4
          },
          {
            "title": "Fumadocs",
            "url": "https://fumadocs.vercel.app/",
            "sortOrder": 5
          },
          {
            "title": "VitePress",
            "url": "https://vitepress.vuejs.org/",
            "sortOrder": 6
          },
          {
            "title": "Dumi",
            "url": "https://d.umijs.org/",
            "sortOrder": 7
          },
          {
            "title": "Docz",
            "url": "https://www.docz.site/",
            "sortOrder": 8
          },
          {
            "title": "GitBook",
            "url": "https://www.gitbook.com/",
            "sortOrder": 9
          },
          {
            "title": "Material for MkDocs",
            "url": "https://squidfunk.github.io/mkdocs-material/",
            "sortOrder": 10
          },
          {
            "title": "Histoire",
            "url": "https://histoire.dev/",
            "sortOrder": 11
          },
          {
            "title": "Mintlify",
            "url": "https://mintlify.com/",
            "sortOrder": 12
          },
          {
            "title": "WordPress.co",
            "url": "https://wordpress.com/",
            "sortOrder": 13
          }
        ]
      },
      {
        "title": "网站部署",
        "sortOrder": 5,
        "bookmarks": [
          {
            "title": "Github Page",
            "url": "https://pages.github.com/",
            "sortOrder": 0
          },
          {
            "title": "Netlify",
            "url": "https://www.netlify.com/",
            "sortOrder": 1
          },
          {
            "title": "Vercel",
            "url": "https://vercel.com/",
            "sortOrder": 2
          },
          {
            "title": "Firebase",
            "url": "https://firebase.google.com/",
            "sortOrder": 3
          },
          {
            "title": "Cloudflare",
            "url": "https://pages.cloudflare.com/",
            "sortOrder": 4
          },
          {
            "title": "Coolify",
            "url": "https://coolify.io/",
            "sortOrder": 5
          },
          {
            "title": "Railway",
            "url": "https://railway.com/",
            "sortOrder": 6
          },
          {
            "title": "Dokploy",
            "url": "https://dokploy.com/",
            "sortOrder": 7
          },
          {
            "title": "Heroku",
            "url": "https://www.heroku.com/",
            "sortOrder": 8
          },
          {
            "title": "Dokku",
            "url": "https://dokku.com/",
            "sortOrder": 9
          },
          {
            "title": "OneClick",
            "url": "https://oneclick.sh/",
            "sortOrder": 10
          }
        ]
      },
      {
        "title": "工具集成",
        "sortOrder": 6,
        "bookmarks": [
          {
            "title": "Slidev",
            "url": "https://cn.sli.dev/",
            "sortOrder": 0,
            "description": "演示文稿工具"
          },
          {
            "title": "WebContainer",
            "url": "https://webcontainers.io/",
            "sortOrder": 1,
            "description": "交互式 IDE"
          },
          {
            "title": "Mermaid",
            "url": "https://mermaid.js.org/",
            "sortOrder": 2,
            "description": "图表绘制工具"
          }
        ]
      },
      {
        "title": "在线 API",
        "sortOrder": 7,
        "bookmarks": [
          {
            "title": "JSONPlaceholder",
            "url": "https://jsonplaceholder.typicode.com/",
            "sortOrder": 0,
            "badgeText": "免费",
            "badgeVariant": "success"
          }
        ]
      },
      {
        "title": "CDN",
        "sortOrder": 8,
        "bookmarks": [
          {
            "title": "UNPKG",
            "url": "https://unpkg.com/",
            "sortOrder": 0
          },
          {
            "title": "ESM",
            "url": "https://esm.sh/",
            "sortOrder": 1
          },
          {
            "title": "JSDeliver",
            "url": "https://www.jsdelivr.com/",
            "sortOrder": 2,
            "extraLinks": [
              {
                "title": "esm.run",
                "url": "https://esm.run/"
              }
            ]
          },
          {
            "title": "cdnjs",
            "url": "https://cdnjs.com/",
            "sortOrder": 3
          },
          {
            "title": "BootCDN",
            "url": "https://www.bootcdn.cn/",
            "sortOrder": 4
          }
        ]
      },
      {
        "title": "镜像站",
        "sortOrder": 9,
        "bookmarks": [
          {
            "title": "MirrorZ Help",
            "url": "https://help.mirrors.cernet.edu.cn/",
            "sortOrder": 0,
            "description": "开源软件镜像的帮助文档整合站点"
          },
          {
            "title": "npmmirror",
            "url": "https://npmmirror.com/",
            "sortOrder": 1
          },
          {
            "title": "aliyun",
            "url": "https://developer.aliyun.com/mirror/",
            "sortOrder": 2
          },
          {
            "title": "USTC",
            "url": "https://mirrors.ustc.edu.cn/",
            "sortOrder": 3,
            "description": "中国科技大学"
          },
          {
            "title": "TUNA",
            "url": "https://tuna.moe/",
            "sortOrder": 4,
            "description": "清华大学"
          }
        ]
      },
      {
        "title": "订阅 RSS",
        "sortOrder": 10,
        "bookmarks": [
          {
            "title": "Follow",
            "url": "https://app.follow.is/",
            "sortOrder": 0
          },
          {
            "title": "Feedly",
            "url": "https://feedly.com/",
            "sortOrder": 1
          },
          {
            "title": "RSSHub",
            "url": "https://docs.rsshub.app/",
            "sortOrder": 2,
            "description": "RSS 生成器"
          }
        ]
      },
      {
        "title": "画布",
        "sortOrder": 11,
        "bookmarks": [
          {
            "title": "Excalidraw",
            "url": "https://excalidraw.com/",
            "sortOrder": 0
          },
          {
            "title": "tldraw",
            "url": "https://www.tldraw.com/",
            "sortOrder": 1
          },
          {
            "title": "PlantUML",
            "url": "https://plantuml.com/zh/",
            "sortOrder": 2,
            "description": "快速编写UML图的组件"
          },
          {
            "title": "图表绘制",
            "url": "https://app.diagrams.net/",
            "sortOrder": 3
          }
        ]
      },
      {
        "title": "在线 IDE",
        "sortOrder": 12,
        "bookmarks": [
          {
            "title": "CodePen",
            "url": "https://codepen.io/",
            "sortOrder": 0
          },
          {
            "title": "StackBlitz",
            "url": "https://stackblitz.com/",
            "sortOrder": 1
          },
          {
            "title": "CodeSandbox",
            "url": "https://codesandbox.io/",
            "sortOrder": 2
          },
          {
            "title": "码上掘金",
            "url": "https://code.juejin.cn/",
            "sortOrder": 3
          },
          {
            "title": "Gitpod",
            "url": "https://www.gitpod.io/",
            "sortOrder": 4
          },
          {
            "title": "Replit",
            "url": "https://replit.com/",
            "sortOrder": 5
          },
          {
            "title": "Sourcegraph",
            "url": "https://sourcegraph.com/",
            "sortOrder": 6
          },
          {
            "title": "GitHub Dev",
            "url": "https://github.dev/github/dev",
            "sortOrder": 7
          },
          {
            "title": "GitHub1s",
            "url": "https://github1s.com/",
            "sortOrder": 8
          },
          {
            "title": "Glitch",
            "url": "https://glitch.com/",
            "sortOrder": 9
          },
          {
            "title": "AST Explorer",
            "url": "https://astexplorer.net/",
            "sortOrder": 10
          },
          {
            "title": "JSFiddle",
            "url": "https://jsfiddle.net/",
            "sortOrder": 11
          }
        ]
      },
      {
        "title": "在线游戏",
        "sortOrder": 13,
        "bookmarks": [
          {
            "title": "type-challenges",
            "url": "https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md",
            "sortOrder": 0,
            "description": "TypeScript 类型体操"
          },
          {
            "title": "TypeHero",
            "url": "https://typehero.dev/",
            "sortOrder": 1
          },
          {
            "title": "Vue.js 挑战",
            "url": "https://cn-vuejs-challenges.netlify.app/",
            "sortOrder": 2,
            "description": "Vue3 在线挑战平台"
          },
          {
            "title": "Learn Git Branching",
            "url": "https://learngitbranching.js.org/?locale=zh_CN",
            "sortOrder": 3,
            "description": "在线 git 学习教程"
          },
          {
            "title": "Grid Garden",
            "url": "https://cssgridgarden.com/#zh-cn",
            "sortOrder": 4,
            "description": "在线 grid 学习教程"
          },
          {
            "title": "Flexbox Defense",
            "url": "http://www.flexboxdefense.com/",
            "sortOrder": 5,
            "description": "在线 flex 学习教程"
          },
          {
            "title": "Svg Tutorial",
            "url": "https://svg-tutorial.com/",
            "sortOrder": 6
          },
          {
            "title": "Codingfantasy",
            "url": "https://codingfantasy.com/",
            "sortOrder": 7
          },
          {
            "title": "学习 CSS 布局",
            "url": "https://zh.learnlayout.com/",
            "sortOrder": 8
          },
          {
            "title": "深入浅出 CSS 布局",
            "url": "http://layout.imweb.io/",
            "sortOrder": 9
          },
          {
            "title": "小霸王",
            "url": "https://www.yikm.net/",
            "sortOrder": 10
          },
          {
            "title": "PlayGama",
            "url": "https://playgama.com/",
            "sortOrder": 11,
            "description": "在线小游戏"
          },
          {
            "title": "PacoGames.com",
            "url": "https://www.pacogames.com/",
            "sortOrder": 12
          }
        ]
      },
      {
        "title": "PDF",
        "sortOrder": 14,
        "bookmarks": [
          {
            "title": "PDF Candy",
            "url": "https://pdfcandy.com/cn/",
            "sortOrder": 0
          },
          {
            "title": "Stirling PDF",
            "url": "https://stirlingpdf.io/",
            "sortOrder": 1
          },
          {
            "title": "TinyWow",
            "url": "https://tinywow.com/",
            "sortOrder": 2
          },
          {
            "title": "Office Converter",
            "url": "https://cn.office-converter.com/",
            "sortOrder": 3,
            "description": "文件转换器"
          },
          {
            "title": "ALL TO ALL",
            "url": "https://www.alltoall.net/",
            "sortOrder": 4,
            "description": "在线格式转换"
          }
        ]
      },
      {
        "title": "资源",
        "sortOrder": 15,
        "bookmarks": [
          {
            "title": "VimAwesome",
            "url": "https://vimawesome.com/",
            "sortOrder": 0
          },
          {
            "title": "VSCodeThemes",
            "url": "https://vscodethemes.com/",
            "sortOrder": 1
          },
          {
            "title": "PowerShell",
            "url": "https://www.pstips.net/",
            "sortOrder": 2
          },
          {
            "title": "NavNav+",
            "url": "https://navnav.co/",
            "sortOrder": 3
          }
        ]
      },
      {
        "title": "在线工具",
        "sortOrder": 16,
        "bookmarks": [
          {
            "title": "Omatsuri",
            "url": "https://omatsuri.app/",
            "sortOrder": 0,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "CSS Generators",
            "url": "https://css-generators.com/",
            "sortOrder": 1,
            "description": "形状元素生成器",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Coupon.io",
            "url": "https://coupon.codelabo.cn/",
            "sortOrder": 2,
            "description": "生成优惠券"
          },
          {
            "title": "Neumorphism",
            "url": "https://neumorphism.io/",
            "sortOrder": 3,
            "description": "生成新拟态设计"
          },
          {
            "title": "FANCY-BORDER-RADIUS",
            "url": "https://9elements.github.io/fancy-border-radius/",
            "sortOrder": 4,
            "description": "花式边界半径"
          },
          {
            "title": "CSS Scan",
            "url": "https://getcssscan.com/css-box-shadow-examples",
            "sortOrder": 5,
            "description": "CSS 阴影示例",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Smooth Shadow",
            "url": "https://smoothshadows.com/",
            "sortOrder": 6
          },
          {
            "title": "Make some waves",
            "url": "https://getwaves.io/",
            "sortOrder": 7
          },
          {
            "title": "Custom Shape Dividers",
            "url": "https://www.shapedivider.app/",
            "sortOrder": 8
          },
          {
            "title": "Easing functions",
            "url": "https://easings.net/",
            "sortOrder": 9,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Easing Wizard",
            "url": "https://easingwizard.com/",
            "sortOrder": 10
          },
          {
            "title": "cubic-bezier()",
            "url": "https://cubic-bezier.com/",
            "sortOrder": 11
          },
          {
            "title": "WebGradients",
            "url": "https://webgradients.com/",
            "sortOrder": 12,
            "description": "线性渐变背景"
          },
          {
            "title": "ColorSpace",
            "url": "https://mycolor.space/",
            "sortOrder": 13
          },
          {
            "title": "Gradient",
            "url": "https://gradient.shapefactory.co/",
            "sortOrder": 14
          },
          {
            "title": "Gradient CSS Generator",
            "url": "https://cssgenerator.org/gradient-css-generator.html",
            "sortOrder": 15
          },
          {
            "title": "Duotones",
            "url": "https://duotones.co/",
            "sortOrder": 16,
            "description": "配对和效果器"
          },
          {
            "title": "Coolors",
            "url": "https://coolors.co/",
            "sortOrder": 17,
            "description": "超级快速的调色板生成器"
          },
          {
            "title": "CSS clip-path maker",
            "url": "https://bennettfeely.com/clippy/",
            "sortOrder": 18,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "CSS Background Patterns",
            "url": "https://www.magicpattern.design/tools/css-backgrounds",
            "sortOrder": 19
          },
          {
            "title": "Pattern Monster",
            "url": "https://cn.pattern.monster/",
            "sortOrder": 20,
            "description": "SVG 图案生成器",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "EnjoyCSS",
            "url": "https://enjoycss.com/",
            "sortOrder": 21
          },
          {
            "title": "CSS Grid Generator",
            "url": "https://cssgrid-generator.netlify.app/",
            "sortOrder": 22,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Layoutit Grid",
            "url": "https://grid.layoutit.com/",
            "sortOrder": 23,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Glass Morphism",
            "url": "https://glassgenerator.netlify.app/",
            "sortOrder": 24,
            "description": "毛玻璃效果",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "UIVerse",
            "url": "https://uiverse.io/",
            "sortOrder": 25
          },
          {
            "title": "CSS Animation Kit",
            "url": "https://angrytools.com/css/animation/",
            "sortOrder": 26
          },
          {
            "title": "Readme Typing SVG",
            "url": "https://readme-typing-svg.demolab.com/",
            "sortOrder": 27
          }
        ]
      },
      {
        "title": "其它",
        "sortOrder": 17,
        "bookmarks": [
          {
            "title": "Small Dev tools",
            "url": "https://smalldev.tools/",
            "sortOrder": 0
          },
          {
            "title": "Moonlight",
            "url": "https://github.com/moonlight-stream/moonlight-qt",
            "sortOrder": 1,
            "description": "游戏串流工具组合",
            "extraLinks": [
              {
                "title": "Sunshine",
                "url": "https://github.com/LizardByte/Sunshine"
              }
            ]
          },
          {
            "title": "pin.gl",
            "url": "https://pin.gl/",
            "sortOrder": 2,
            "description": "共享屏幕"
          },
          {
            "title": "Jitsi Meet",
            "url": "https://meet.jit.si/",
            "sortOrder": 3,
            "description": "在线视频会议"
          },
          {
            "title": "Codeshare",
            "url": "https://codeshare.io/",
            "sortOrder": 4,
            "description": "实时共享代码"
          },
          {
            "title": "RGBA Color Picker",
            "url": "https://rgbacolorpicker.com/",
            "sortOrder": 5
          },
          {
            "title": "IT-TOOLS",
            "url": "https://it-tools.tech/",
            "sortOrder": 6
          },
          {
            "title": "Table Convert Online",
            "url": "https://tableconvert.com/",
            "sortOrder": 7
          },
          {
            "title": "SVGOMG",
            "url": "https://jakearchibald.github.io/svgomg/",
            "sortOrder": 8
          },
          {
            "title": "jsonhero",
            "url": "https://jsonhero.io/",
            "sortOrder": 9
          },
          {
            "title": "Json.cn",
            "url": "https://www.json.cn/",
            "sortOrder": 10,
            "description": "JSON 在线解析及格式化验证"
          },
          {
            "title": "草料二维码生成器",
            "url": "https://cli.im/",
            "sortOrder": 11
          },
          {
            "title": "QR Generator",
            "url": "https://www.online-qrcode-generator.com/",
            "sortOrder": 12
          },
          {
            "title": "QR.io",
            "url": "https://qr.io/",
            "sortOrder": 13,
            "description": "二维码生成器"
          },
          {
            "title": "哔哩哔哩(bilibili)视频解析下载",
            "url": "https://bilibili.iiilab.com/",
            "sortOrder": 14
          },
          {
            "title": "Microsoft Azure",
            "url": "https://azure.microsoft.com/zh-cn/products/cognitive-services/text-to-speech/#features",
            "sortOrder": 15,
            "description": "文本转语音"
          },
          {
            "title": "WakaTime",
            "url": "https://wakatime.com/",
            "sortOrder": 16,
            "description": "开发者的仪表盘，时间统计"
          },
          {
            "title": "IP Address",
            "url": "https://www.ipaddress.com/",
            "sortOrder": 17
          },
          {
            "title": "SMS-Active",
            "url": "https://sms-activate.guru/cn",
            "sortOrder": 18,
            "description": "在线接收验证码"
          },
          {
            "title": "7SIM.CC",
            "url": "https://7sim.cc/en",
            "sortOrder": 19,
            "description": "接收短信的临时虚拟号码"
          }
        ]
      }
    ]
  },
  {
    "title": "开发相关",
    "sortOrder": 1,
    "stagger": true,
    "cards": [
      {
        "title": "官方网站",
        "sortOrder": 0,
        "bookmarks": [
          {
            "title": "MDN Web Docs",
            "url": "https://developer.mozilla.org/",
            "sortOrder": 0
          },
          {
            "title": "World Wide Web Consortium (W3C)",
            "url": "https://www.w3.org/",
            "sortOrder": 1
          },
          {
            "title": "TC39 – Specifying JavaScript",
            "url": "https://tc39.es/",
            "sortOrder": 2
          },
          {
            "title": "WHATWG",
            "url": "https://github.com/whatwg",
            "sortOrder": 3
          },
          {
            "title": "JavaScript Tutorial",
            "url": "https://www.javascripttutorial.net/",
            "sortOrder": 4
          },
          {
            "title": "V8 JavaScript engine",
            "url": "https://v8.dev/",
            "sortOrder": 5
          },
          {
            "title": "GitHub Docs",
            "url": "https://docs.github.com/",
            "sortOrder": 6
          },
          {
            "title": "谷歌开发者平台",
            "url": "https://developers.google.com/",
            "sortOrder": 7
          },
          {
            "title": "Chrome for developers",
            "url": "https://developer.chrome.com/",
            "sortOrder": 8
          },
          {
            "title": "Google 产品",
            "url": "https://about.google/intl/zh-CN/products/#all-products",
            "sortOrder": 9
          },
          {
            "title": "Microsoft 开发人员",
            "url": "https://developer.microsoft.com/",
            "sortOrder": 10
          }
        ]
      },
      {
        "title": "面试",
        "sortOrder": 1,
        "bookmarks": [
          {
            "title": "JavaScript 进阶问题列表",
            "url": "https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md",
            "sortOrder": 0,
            "badgeText": "Github",
            "badgeVariant": "github"
          },
          {
            "title": "反向面试",
            "url": "https://github.com/yifeikong/reverse-interview-zh",
            "sortOrder": 1,
            "badgeText": "Github",
            "badgeVariant": "github"
          },
          {
            "title": "前端面试指南",
            "url": "https://interview2.poetries.top/",
            "sortOrder": 2
          },
          {
            "title": "前端面试题汇总",
            "url": "https://www.yuque.com/cuggz/interview",
            "sortOrder": 3,
            "badgeText": "语雀",
            "badgeVariant": "info"
          },
          {
            "title": "字节面试题",
            "url": "https://bytedance.feishu.cn/base/app8Ok6k9qafpMkgyRbfgxeEnet?table=tblzZHf2Ix3YtxPM&view=vew9iquA45",
            "sortOrder": 4,
            "badgeText": "飞书",
            "badgeVariant": "info"
          },
          {
            "title": "web 前端面试",
            "url": "https://vue3js.cn/interview/",
            "sortOrder": 5
          },
          {
            "title": "前端面试派",
            "url": "https://www.mianshipai.com/",
            "sortOrder": 6
          },
          {
            "title": "前端工作面试问题",
            "url": "https://h5bp.org/Front-end-Developer-Interview-Questions/translations/chinese/",
            "sortOrder": 7
          },
          {
            "title": "浏览器的工作原理：新式网络浏览器幕后揭秘",
            "url": "https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/#The_browsers_we_will_talk_about",
            "sortOrder": 8
          },
          {
            "title": "性能优化作战手册 - 语雀",
            "url": "https://www.yuque.com/cuggz/interview/lph6i8",
            "sortOrder": 9
          }
        ]
      },
      {
        "title": "功能资源",
        "sortOrder": 2,
        "bookmarks": [
          {
            "title": "StateOfJS",
            "url": "https://stateofjs.com/en-US",
            "sortOrder": 0
          },
          {
            "title": "StateOfCSS",
            "url": "https://stateofcss.com/en-US",
            "sortOrder": 1
          },
          {
            "title": "bestofjs",
            "url": "https://bestofjs.org/",
            "sortOrder": 2,
            "description": "开源项目平台"
          },
          {
            "title": "OSS Insight",
            "url": "https://ossinsight.io/",
            "sortOrder": 3,
            "description": "开源软件分析平台"
          },
          {
            "title": "ProductHunt",
            "url": "https://www.producthunt.com/",
            "sortOrder": 4,
            "description": "发掘有意思产品的平台"
          },
          {
            "title": "Indie Hackers Site",
            "url": "https://www.indiehackers.site/",
            "sortOrder": 5,
            "description": "分享网络工具和平台"
          },
          {
            "title": "runpkg",
            "url": "https://www.runpkg.com/",
            "sortOrder": 6,
            "description": "在线查看 npm 包的代码"
          },
          {
            "title": "Bundlephobia",
            "url": "https://bundlephobia.com/",
            "sortOrder": 7,
            "description": "查找包中添加 npm 包的成本"
          },
          {
            "title": "Renovate",
            "url": "https://github.com/renovatebot/renovate",
            "sortOrder": 8,
            "description": "跨平台依赖自动化"
          },
          {
            "title": "Semantic Scholar",
            "url": "https://www.semanticscholar.org/",
            "sortOrder": 9,
            "description": "人工智能驱动的研究工具"
          }
        ]
      },
      {
        "title": "开发规范",
        "sortOrder": 3,
        "bookmarks": [
          {
            "title": "TGideas文档库",
            "url": "https://tgideas.qq.com/doc/index.html",
            "sortOrder": 0
          },
          {
            "title": "JavaScript编码规范",
            "url": "https://github.com/ecomfe/spec/blob/master/javascript-style-guide.md",
            "sortOrder": 1,
            "badgeText": "Github",
            "badgeVariant": "github"
          },
          {
            "title": "Airbnb JavaScript 风格指南",
            "url": "https://lin-123.github.io/javascript/",
            "sortOrder": 2,
            "badgeText": "Github",
            "badgeVariant": "github"
          },
          {
            "title": "JavaScript Standard Style",
            "url": "https://github.com/standard/standard/blob/master/docs/README-zhcn.md",
            "sortOrder": 3,
            "badgeText": "Github",
            "badgeVariant": "github"
          },
          {
            "title": "Aotu.io",
            "url": "https://guide.aotu.io/index.html",
            "sortOrder": 4
          },
          {
            "title": "Code Guide",
            "url": "https://codeguide.bootcss.com/",
            "sortOrder": 5
          }
        ]
      },
      {
        "title": "导航",
        "sortOrder": 4,
        "bookmarks": [
          {
            "title": "ExplainThis",
            "url": "https://www.explainthis.io/zh-hans",
            "sortOrder": 0,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Dev Tools",
            "url": "https://freetool.vercel.app/",
            "sortOrder": 1,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Open Source Software",
            "url": "https://osssoftware.org/",
            "sortOrder": 2,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Awehunt",
            "url": "https://awehunt.com/",
            "sortOrder": 3
          },
          {
            "title": "OverAPI.com",
            "url": "https://overapi.com/",
            "sortOrder": 4,
            "description": "收集所有备忘单"
          },
          {
            "title": "Bootstrap中文网",
            "url": "https://www.bootcss.com/",
            "sortOrder": 5
          },
          {
            "title": "GitHub中文社区",
            "url": "https://www.github-zh.com/",
            "sortOrder": 6
          },
          {
            "title": "印记中文",
            "url": "https://docschina.org/",
            "sortOrder": 7
          },
          {
            "title": "Web前端导航",
            "url": "http://www.alloyteam.com/nav/",
            "sortOrder": 8
          },
          {
            "title": "fly63前端网",
            "url": "https://www.fly63.com/",
            "sortOrder": 9
          }
        ]
      },
      {
        "title": "英语相关",
        "sortOrder": 5,
        "bookmarks": [
          {
            "title": "多邻国",
            "url": "https://www.duolingo.cn/",
            "sortOrder": 0
          },
          {
            "title": "LingoHut",
            "url": "https://www.lingohut.com/zh/l1/%E5%AD%A6%E4%B9%A0%E8%8B%B1%E8%AF%AD",
            "sortOrder": 1,
            "description": "免费英语课程"
          },
          {
            "title": "英语听力课堂",
            "url": "https://www.tingclass.net/",
            "sortOrder": 2
          },
          {
            "title": "Relingo",
            "url": "https://relingo.net/",
            "sortOrder": 3,
            "badgeText": "插件",
            "badgeVariant": "tip"
          },
          {
            "title": "Trancy",
            "url": "https://www.trancy.org/",
            "sortOrder": 4,
            "badgeText": "插件",
            "badgeVariant": "tip"
          },
          {
            "title": "新概念英语",
            "url": "http://www.newconceptenglish.com/",
            "sortOrder": 5
          },
          {
            "title": "程序员英语词汇宝典",
            "url": "https://words.aihub.ren/",
            "sortOrder": 6
          },
          {
            "title": "TypeLit.io",
            "url": "https://www.typelit.io/",
            "sortOrder": 7,
            "badgeText": "打字",
            "badgeVariant": "tip"
          },
          {
            "title": "TypingClub",
            "url": "https://www.typingclub.com/sportal/",
            "sortOrder": 8,
            "badgeText": "打字",
            "badgeVariant": "tip"
          },
          {
            "title": "Type Words",
            "url": "https://2study.top/",
            "sortOrder": 9,
            "description": "开源单词与文章练习工具"
          },
          {
            "title": "Qwerty Learner",
            "url": "https://qwerty.kaiyi.cool/",
            "sortOrder": 10,
            "badgeText": "打字",
            "badgeVariant": "tip"
          },
          {
            "title": "A Programmer's Guide to English",
            "url": "https://a-programmers-guide-to-english.harryyu.me/",
            "sortOrder": 11,
            "badgeText": "书籍",
            "badgeVariant": "tip"
          },
          {
            "title": "English-level-up-tips-for-Chinese",
            "url": "https://byoungd.gitbook.io/english-level-up-tips/",
            "sortOrder": 12,
            "badgeText": "书籍",
            "badgeVariant": "tip"
          },
          {
            "title": "英语真题在线",
            "url": "https://zhenti.burningvocabulary.com/",
            "sortOrder": 13
          },
          {
            "title": "新概念英语",
            "url": "https://www.newconceptenglish.com/",
            "sortOrder": 14
          }
        ]
      },
      {
        "title": "工具",
        "sortOrder": 6,
        "bookmarks": [
          {
            "title": "Dify",
            "url": "https://dify.ai/",
            "sortOrder": 0,
            "description": "Agentic AI 解决方案"
          },
          {
            "title": "n8n",
            "url": "https://n8n.io/",
            "sortOrder": 1,
            "description": "免费开源的工作流自动化工具"
          },
          {
            "title": "Webflow",
            "url": "https://webflow.com/",
            "sortOrder": 2
          },
          {
            "title": "Automa",
            "url": "https://www.automa.site/",
            "sortOrder": 3
          },
          {
            "title": "ToDesktop",
            "url": "https://www.todesktop.com/",
            "sortOrder": 4
          },
          {
            "title": "Storybook",
            "url": "https://storybook.js.org/",
            "sortOrder": 5,
            "description": "UI 组件开发环境"
          }
        ]
      },
      {
        "title": "Logo",
        "sortOrder": 7,
        "bookmarks": [
          {
            "title": "svgl",
            "url": "https://svgl.app/",
            "sortOrder": 0,
            "description": "品牌徽标",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "LobeHub Icons",
            "url": "https://icons.lobehub.com/",
            "sortOrder": 1
          },
          {
            "title": "APPLORE",
            "url": "https://app.uiboy.com/",
            "sortOrder": 2,
            "description": "发现和探索应用程序图标",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "macOSicons",
            "url": "https://macosicons.com/",
            "sortOrder": 3,
            "description": "更换 mac 应用图标",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Developer Icons",
            "url": "https://xandemon.github.io/developer-icons/icons/All/",
            "sortOrder": 4
          },
          {
            "title": "BrandFetch",
            "url": "https://brandfetch.com/",
            "sortOrder": 5,
            "description": "互联网的标志和品牌资产的来源"
          }
        ]
      },
      {
        "title": "其它",
        "sortOrder": 8,
        "bookmarks": [
          {
            "title": "PageSpeed Insights",
            "url": "https://pagespeed.web.dev/",
            "sortOrder": 0,
            "description": "报告页面性能"
          },
          {
            "title": "Webshare",
            "url": "https://www.webshare.io/",
            "sortOrder": 1,
            "description": "代理服务评测"
          },
          {
            "title": "doyoudo",
            "url": "https://www.doyoudo.com/",
            "sortOrder": 2,
            "description": "资源学习网站"
          },
          {
            "title": "wikiHow",
            "url": "https://zh.wikihow.com/",
            "sortOrder": 3,
            "description": "最值得信赖的指南网站",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "FreeCodeCamp",
            "url": "https://www.freecodecamp.org/chinese/",
            "sortOrder": 4
          },
          {
            "title": "W3Schools.com",
            "url": "https://www.quanzhanketang.com/",
            "sortOrder": 5
          },
          {
            "title": "Newsela",
            "url": "https://newsela.com/",
            "sortOrder": 6
          },
          {
            "title": "CodeGym",
            "url": "https://codegym.cc/zh/",
            "sortOrder": 7,
            "description": "在线 Java 语言编程课程",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Exercism",
            "url": "https://exercism.org/",
            "sortOrder": 8,
            "description": "免费在线编程",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "设计达人",
            "url": "https://www.shejidaren.com/",
            "sortOrder": 9,
            "description": "爱设计，爱分享"
          }
        ]
      }
    ]
  },
  {
    "title": "书籍资源",
    "sortOrder": 2,
    "stagger": true,
    "cards": [
      {
        "title": "热门",
        "sortOrder": 0,
        "bookmarks": [
          {
            "title": "ES6 入门教程",
            "url": "http://es6.ruanyifeng.com/",
            "sortOrder": 0
          },
          {
            "title": "现代 JavaScript 教程",
            "url": "https://zh.javascript.info/",
            "sortOrder": 1
          },
          {
            "title": "JavaScript 二十年",
            "url": "https://cn.history.js.org/",
            "sortOrder": 2
          },
          {
            "title": "前端内参",
            "url": "https://coffe1891.gitbook.io/frontend-hard-mode-interview/",
            "sortOrder": 3
          },
          {
            "title": "JavaScript Promise迷你书",
            "url": "http://liubin.org/promises-book/",
            "sortOrder": 4
          },
          {
            "title": "30secondsofcode",
            "url": "https://www.30secondsofcode.org/",
            "sortOrder": 5
          },
          {
            "title": "Discover three.js",
            "url": "https://discoverthreejs.com/",
            "sortOrder": 6
          },
          {
            "title": "Tech Interview Handbook",
            "url": "https://www.techinterviewhandbook.org/",
            "sortOrder": 7
          },
          {
            "title": "free-programming-books",
            "url": "https://ebookfoundation.github.io/free-programming-books/books/free-programming-books-zh.html",
            "sortOrder": 8
          },
          {
            "title": "CS自学指南",
            "url": "https://csdiy.wiki/",
            "sortOrder": 9
          },
          {
            "title": "鸟哥的Linux私房菜第四版",
            "url": "https://wizardforcel.gitbooks.io/vbird-linux-basic-4e/content/index.html",
            "sortOrder": 10
          },
          {
            "title": "书栈网",
            "url": "https://www.bookstack.cn/",
            "sortOrder": 11
          },
          {
            "title": "互联网开发文档",
            "url": "https://wangdoc.com/",
            "sortOrder": 12
          }
        ]
      },
      {
        "title": "GitHub",
        "sortOrder": 1,
        "bookmarks": [
          {
            "title": "开源软件指南",
            "url": "https://opensource.guide/zh-hans/",
            "sortOrder": 0
          },
          {
            "title": "开源指北",
            "url": "https://gitee.com/opensource-guide/",
            "sortOrder": 1
          },
          {
            "title": "掘金翻译计划",
            "url": "https://github.com/xitu/gold-miner",
            "sortOrder": 2
          },
          {
            "title": "50 Projects in 50 Days",
            "url": "https://github.com/bradtraversy/50projects50days",
            "sortOrder": 3
          },
          {
            "title": "VS Code 插件创作中文开发文档",
            "url": "https://liiked.github.io/VS-Code-Extension-Doc-ZH",
            "sortOrder": 4
          },
          {
            "title": "awesome-vue",
            "url": "https://github.com/vuejs/awesome-vue",
            "sortOrder": 5
          },
          {
            "title": "awesome-github-vue",
            "url": "https://github.com/opendigg/awesome-github-vue",
            "sortOrder": 6
          },
          {
            "title": "awesome-wechat-weapp",
            "url": "https://github.com/Aufree/awesome-wechat-weapp",
            "sortOrder": 7
          },
          {
            "title": "awesome-design-cn",
            "url": "https://github.com/jobbole/awesome-design-cn",
            "sortOrder": 8
          },
          {
            "title": "Clone-Wars",
            "url": "https://github.com/GorvGoyl/Clone-Wars",
            "sortOrder": 9
          },
          {
            "title": "github-readme-stats",
            "url": "https://github.com/anuraghazra/github-readme-stats/blob/master/docs/readme_cn.md",
            "sortOrder": 10
          },
          {
            "title": "github-profile-trophy",
            "url": "https://github.com/ryo-ma/github-profile-trophy",
            "sortOrder": 11
          },
          {
            "title": "GitHub Readme Activity Graph",
            "url": "https://ashutosh00710.github.io/github-readme-activity-graph/",
            "sortOrder": 12
          },
          {
            "title": "Git飞行规则(Flight Rules)",
            "url": "https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md",
            "sortOrder": 13
          }
        ]
      },
      {
        "title": "算法",
        "sortOrder": 2,
        "bookmarks": [
          {
            "title": "The Algorithms",
            "url": "https://the-algorithms.com/",
            "sortOrder": 0,
            "badgeText": "推荐",
            "badgeVariant": "success"
          },
          {
            "title": "Hello 算法",
            "url": "https://www.hello-algo.com/",
            "sortOrder": 1,
            "badgeText": "推荐",
            "badgeVariant": "success"
          },
          {
            "title": "算法通关之路",
            "url": "https://leetcode-solution-leetcode-pp.gitbook.io/leetcode-solution/",
            "sortOrder": 2
          },
          {
            "title": "JavaScript 算法与数据结构",
            "url": "https://github.com/trekhleb/javascript-algorithms/blob/master/README.zh-CN.md",
            "sortOrder": 3,
            "badgeText": "Github",
            "badgeVariant": "github"
          },
          {
            "title": "VisuAlgo",
            "url": "https://visualgo.net/zh",
            "sortOrder": 4,
            "description": "数据结构和算法动态可视化"
          },
          {
            "title": "JS Visualizer 9000",
            "url": "https://www.jsv9000.app/",
            "sortOrder": 5
          }
        ]
      },
      {
        "title": "其它",
        "sortOrder": 3,
        "bookmarks": [
          {
            "title": "程序员如何优雅的挣零花钱？",
            "url": "https://howto-make-more-money-easychen.vercel.app/",
            "sortOrder": 0
          },
          {
            "title": "程序员成长指北",
            "url": "http://www.inode.club/",
            "sortOrder": 1
          },
          {
            "title": "人人都能学会的 WordPress 实战课",
            "url": "https://www.easywpbook.com/",
            "sortOrder": 2
          }
        ]
      }
    ]
  },
  {
    "title": "图片相关",
    "sortOrder": 3,
    "stagger": true,
    "cards": [
      {
        "title": "开发使用",
        "sortOrder": 0,
        "bookmarks": [
          {
            "title": "Lorem Picsum",
            "url": "https://picsum.photos/",
            "sortOrder": 0,
            "description": "随机图片库",
            "badgeText": "推荐",
            "badgeVariant": "success"
          },
          {
            "title": "Image Converter",
            "url": "https://imageconverter.dev/",
            "sortOrder": 1,
            "description": "免费在线图片转换器"
          },
          {
            "title": "Pluspng",
            "url": "https://pluspng.com/",
            "sortOrder": 2,
            "description": "Free PNG Image Library",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "unDraw",
            "url": "https://undraw.co/illustrations",
            "sortOrder": 3,
            "description": "生成动态彩色图像",
            "badgeText": "hot",
            "badgeVariant": "hot"
          }
        ]
      },
      {
        "title": "代码片段",
        "sortOrder": 1,
        "bookmarks": [
          {
            "title": "Carbon",
            "url": "https://carbon.now.sh/",
            "sortOrder": 0
          },
          {
            "title": "Code to Image Converter",
            "url": "https://codetoimg.com/",
            "sortOrder": 1
          }
        ]
      },
      {
        "title": "徽章图标",
        "sortOrder": 2,
        "bookmarks": [
          {
            "title": "Shields.io",
            "url": "https://shields.io/",
            "sortOrder": 0,
            "description": "徽章制作工具",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Badgen",
            "url": "https://badgen.net/",
            "sortOrder": 1,
            "description": "角标制作工具",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "DiceBear",
            "url": "https://www.dicebear.com/",
            "sortOrder": 2,
            "description": "头像生成器"
          },
          {
            "title": "Favicon.io",
            "url": "https://favicon.io/",
            "sortOrder": 3,
            "description": "在线 favicon 生成器"
          },
          {
            "title": "Favicon Generator",
            "url": "https://realfavicongenerator.net/",
            "sortOrder": 4,
            "description": "浏览器图标"
          },
          {
            "title": "LogolyPro",
            "url": "https://www.logoly.pro/",
            "sortOrder": 5,
            "description": "在线标识生成器"
          },
          {
            "title": "Blue Emoji",
            "url": "https://bluemoji.io/",
            "sortOrder": 6,
            "description": "非常感性的表情符号和笑脸"
          },
          {
            "title": "emoji-cheat-sheet",
            "url": "https://github.com/ikatyang/emoji-cheat-sheet#smileys--emotion",
            "sortOrder": 7,
            "description": "Emoji 表情代码"
          },
          {
            "title": "Emojipedia",
            "url": "https://emojipedia.org/",
            "sortOrder": 8,
            "description": "😃表情符号意义之家💁👌🎍😍"
          }
        ]
      },
      {
        "title": "在线图库",
        "sortOrder": 3,
        "bookmarks": [
          {
            "title": "Unsplash",
            "url": "https://unsplash.com/",
            "sortOrder": 0,
            "badgeText": "自由使用",
            "badgeVariant": "success"
          },
          {
            "title": "WallpaperHub",
            "url": "https://wallpaperhub.app/",
            "sortOrder": 1
          },
          {
            "title": "搜图神器",
            "url": "https://www.logosc.cn/so/",
            "sortOrder": 2
          },
          {
            "title": "Pexels",
            "url": "https://www.pexels.com/zh-cn/",
            "sortOrder": 3
          },
          {
            "title": "WallpapersCraft",
            "url": "https://wallpaperscraft.com/",
            "sortOrder": 4
          },
          {
            "title": "WallpaperMaiden",
            "url": "https://wallpapersden.com/",
            "sortOrder": 5
          },
          {
            "title": "Newcger",
            "url": "https://www.newcger.com/",
            "sortOrder": 6
          }
        ]
      },
      {
        "title": "压缩转换",
        "sortOrder": 4,
        "bookmarks": [
          {
            "title": "Compressor.io",
            "url": "https://compressor.io/",
            "sortOrder": 0
          },
          {
            "title": "Squoosh",
            "url": "https://squoosh.app/",
            "sortOrder": 1
          },
          {
            "title": "OptimiZilla",
            "url": "http://optimizilla.com/",
            "sortOrder": 2,
            "badgeText": "自由使用",
            "badgeVariant": "success"
          },
          {
            "title": "Picdiet",
            "url": "https://picdiet.eula.club/",
            "sortOrder": 3
          },
          {
            "title": "BASE64",
            "url": "https://www.base64-image.de/",
            "sortOrder": 4
          }
        ]
      },
      {
        "title": "在线编辑",
        "sortOrder": 5,
        "bookmarks": [
          {
            "title": "佐糖",
            "url": "https://picwish.cn/",
            "sortOrder": 0,
            "description": "AI 在线抠图"
          },
          {
            "title": "remove.bg",
            "url": "https://www.remove.bg/zh",
            "sortOrder": 1,
            "description": "图片去除背景"
          },
          {
            "title": "Annotely",
            "url": "https://annotely.com/",
            "sortOrder": 2,
            "description": "随时随地标注任何图像",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "Edit • Photo",
            "url": "https://edit.photo/",
            "sortOrder": 3
          },
          {
            "title": "Shots",
            "url": "https://shots.so/",
            "sortOrder": 4,
            "description": "生成不同机型截图",
            "badgeText": "hot",
            "badgeVariant": "hot"
          }
        ]
      },
      {
        "title": "其它",
        "sortOrder": 6,
        "bookmarks": [
          {
            "title": "Pixabay",
            "url": "https://pixabay.com/",
            "sortOrder": 0,
            "description": "免费的多媒体资源库"
          },
          {
            "title": "pngimg.com",
            "url": "https://pngimg.com/",
            "sortOrder": 1,
            "description": "PNG 图像资源"
          },
          {
            "title": "Mosh",
            "url": "https://moshpro.app/",
            "sortOrder": 2,
            "description": "为图像+视频提供无限的创意实时效果"
          },
          {
            "title": "钙网",
            "url": "https://www.uugai.com/",
            "sortOrder": 3,
            "description": "LOGO 在线设计制作工具"
          }
        ]
      },
      {
        "title": "在线图床",
        "sortOrder": 7,
        "bookmarks": [
          {
            "title": "SM.MS",
            "url": "https://smms.app/",
            "sortOrder": 0
          }
        ]
      }
    ]
  },
  {
    "title": "Icon 相关",
    "sortOrder": 4,
    "stagger": true,
    "cards": [
      {
        "title": "常用",
        "sortOrder": 0,
        "bookmarks": [
          {
            "title": "Iconify",
            "url": "https://preview.iconify.design/",
            "sortOrder": 0,
            "description": "自由选择图标"
          },
          {
            "title": "Icônes",
            "url": "https://icones.js.org/",
            "sortOrder": 1,
            "description": "即时搜索图标资源管理器",
            "badgeText": "开发",
            "badgeVariant": "tip"
          },
          {
            "title": "Lucide Icons",
            "url": "https://lucide.dev/",
            "sortOrder": 2,
            "description": "美观且一致的图标",
            "badgeText": "开发",
            "badgeVariant": "tip"
          },
          {
            "title": "Remix Icon",
            "url": "https://remixicon.com/",
            "sortOrder": 3
          },
          {
            "title": "Isocons",
            "url": "https://www.isocons.app/",
            "sortOrder": 4
          },
          {
            "title": "ByteDance IconPark",
            "url": "https://iconpark.oceanengine.com/official",
            "sortOrder": 5
          },
          {
            "title": "iconfont",
            "url": "https://www.iconfont.cn/",
            "sortOrder": 6,
            "description": "阿里巴巴矢量图标库"
          },
          {
            "title": "Bootstrap 图标库",
            "url": "https://icons.bootcss.com/",
            "sortOrder": 7
          },
          {
            "title": "Font Awesome",
            "url": "https://fontawesome.com/",
            "sortOrder": 8
          }
        ]
      },
      {
        "title": "其它",
        "sortOrder": 1,
        "bookmarks": [
          {
            "title": "Lordicon",
            "url": "https://lordicon.com/",
            "sortOrder": 0,
            "description": "动画图标"
          },
          {
            "title": "Eva Icons",
            "url": "https://akveo.github.io/eva-icons/",
            "sortOrder": 1
          },
          {
            "title": "Xicons",
            "url": "https://www.xicons.org/",
            "sortOrder": 2
          },
          {
            "title": "MingCute Icon",
            "url": "https://www.mingcute.com/",
            "sortOrder": 3
          },
          {
            "title": "IconRainbow",
            "url": "https://free-icon-rainbow.com/",
            "sortOrder": 4
          },
          {
            "title": "Icons8",
            "url": "https://icons8.com/",
            "sortOrder": 5,
            "description": "设计人员和开发人员的终极设计套件"
          },
          {
            "title": "Boxicons",
            "url": "https://boxicons.com/",
            "sortOrder": 6,
            "description": "免费的高级网络友好图标"
          },
          {
            "title": "Icon Archive",
            "url": "https://iconarchive.com/",
            "sortOrder": 7,
            "description": "免费、桌面、社交、xp、vista 图标"
          },
          {
            "title": "Flaticon",
            "url": "https://www.flaticon.com/",
            "sortOrder": 8,
            "description": "数百万资源可供下载"
          }
        ]
      }
    ]
  },
  {
    "title": "AI 相关",
    "sortOrder": 5,
    "stagger": true,
    "cards": [
      {
        "title": "AI",
        "sortOrder": 0,
        "bookmarks": [
          {
            "title": "DeepSeek",
            "url": "https://chat.deepseek.com/",
            "sortOrder": 0
          },
          {
            "title": "ChatGPT",
            "url": "https://chatgpt.com/",
            "sortOrder": 1
          },
          {
            "title": "Claude",
            "url": "https://claude.ai/",
            "sortOrder": 2
          },
          {
            "title": "Copilot",
            "url": "https://copilot.microsoft.com/",
            "sortOrder": 3
          },
          {
            "title": "Grok",
            "url": "https://grok.com/",
            "sortOrder": 4
          },
          {
            "title": "Gemini",
            "url": "https://gemini.google.com/",
            "sortOrder": 5
          },
          {
            "title": "MiniMax",
            "url": "https://agent.minimax.io/",
            "sortOrder": 6
          },
          {
            "title": "Meta AI",
            "url": "https://ai.meta.com/",
            "sortOrder": 7
          },
          {
            "title": "Qwen",
            "url": "https://chat.qwen.ai/",
            "sortOrder": 8
          },
          {
            "title": "AI SDK",
            "url": "http://ai-sdk.dev/",
            "sortOrder": 9,
            "badgeText": "vercel",
            "badgeVariant": "purple"
          },
          {
            "title": "AutoGPT",
            "url": "https://agpt.co/",
            "sortOrder": 10
          },
          {
            "title": "Poe",
            "url": "https://poe.com/",
            "sortOrder": 11,
            "description": "聚合 AI 聊天"
          },
          {
            "title": "OpenRouter",
            "url": "https://openrouter.ai/",
            "sortOrder": 12
          },
          {
            "title": "LobeChat",
            "url": "https://lobechat.com/",
            "sortOrder": 13
          },
          {
            "title": "NextChat",
            "url": "https://nextchat.club/",
            "sortOrder": 14
          },
          {
            "title": "Napkin",
            "url": "https://www.napkin.ai/",
            "sortOrder": 15
          },
          {
            "title": "Hume",
            "url": "https://www.hume.ai/",
            "sortOrder": 16,
            "description": "语音模型"
          },
          {
            "title": "Suno",
            "url": "https://suno.com/",
            "sortOrder": 17,
            "description": "生成歌曲"
          }
        ]
      },
      {
        "title": "产品",
        "sortOrder": 1,
        "bookmarks": [
          {
            "title": "MCP",
            "url": "https://modelcontextprotocol.io/",
            "sortOrder": 0,
            "description": "模型上下文协议"
          },
          {
            "title": "Artificial Analysis",
            "url": "https://artificialanalysis.ai/",
            "sortOrder": 1,
            "description": "人工智能产品分析平台"
          },
          {
            "title": "Hugging Face",
            "url": "https://huggingface.co/",
            "sortOrder": 2,
            "description": "构建未来的 AI 社区",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "GPTs Hunter",
            "url": "https://www.gptshunter.com/",
            "sortOrder": 3,
            "description": "发现 GPT 商店"
          },
          {
            "title": "AITools",
            "url": "https://aitools.inc/",
            "sortOrder": 4,
            "description": "寻找 AI 工具来帮助您"
          },
          {
            "title": "ToolAI",
            "url": "https://www.toolai.io/",
            "sortOrder": 5,
            "description": "发现最佳人工智能网站"
          },
          {
            "title": "human or not",
            "url": "https://www.humanornot.co/",
            "sortOrder": 6,
            "description": "获取最新的 AI 新闻和工具"
          },
          {
            "title": "DeepWiki",
            "url": "https://deepwiki.com/",
            "sortOrder": 7,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "ComfyUI",
            "url": "https://www.comfy.org/",
            "sortOrder": 8
          },
          {
            "title": "SiteSnapper",
            "url": "https://sitesnapper.app/",
            "sortOrder": 9,
            "description": "一键捕获任意网页",
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "prompts.chat",
            "url": "https://prompts.chat/",
            "sortOrder": 10,
            "description": "提示目录"
          }
        ]
      },
      {
        "title": "在线",
        "sortOrder": 2,
        "bookmarks": [
          {
            "title": "bolt",
            "url": "https://bolt.new/",
            "sortOrder": 0
          },
          {
            "title": "v0",
            "url": "https://v0.app/",
            "sortOrder": 1
          },
          {
            "title": "AI Studio",
            "url": "https://aistudio.google.com/",
            "sortOrder": 2
          },
          {
            "title": "Tinte",
            "url": "https://www.tinte.dev/",
            "sortOrder": 3
          },
          {
            "title": "Reweb",
            "url": "https://www.reweb.so/",
            "sortOrder": 4
          }
        ]
      }
    ]
  },
  {
    "title": "设计相关",
    "sortOrder": 6,
    "stagger": false,
    "cards": [
      {
        "title": "资源",
        "sortOrder": 0,
        "bookmarks": [
          {
            "title": "Dribbble",
            "url": "https://dribbble.com/",
            "sortOrder": 0,
            "description": "发现世界顶级设计师"
          },
          {
            "title": "Design Systems Database",
            "url": "https://designsystems.surf/",
            "sortOrder": 1,
            "description": "导航"
          },
          {
            "title": "Fountn",
            "url": "https://fountn.design/",
            "sortOrder": 2,
            "description": "导航"
          },
          {
            "title": "GoodDesignTools",
            "url": "https://www.gooddesign.tools/",
            "sortOrder": 3
          },
          {
            "title": "Rive",
            "url": "https://rive.app/",
            "sortOrder": 4,
            "description": "图形的设计工具"
          },
          {
            "title": "DarkDesign",
            "url": "https://www.dark.design/",
            "sortOrder": 5,
            "description": "暗黑主题精选网站"
          },
          {
            "title": "Footer",
            "url": "https://www.footer.design/",
            "sortOrder": 6
          },
          {
            "title": "Landingly",
            "url": "https://www.landingly.co/",
            "sortOrder": 7,
            "description": "登陆页面设计"
          },
          {
            "title": "Godly",
            "url": "https://godly.website/",
            "sortOrder": 8,
            "description": "出色的网页设计灵感"
          },
          {
            "title": "Awwwards",
            "url": "https://www.awwwards.com/",
            "sortOrder": 9,
            "description": "最权威网页设计投票"
          },
          {
            "title": "curated.design",
            "url": "https://www.curated.design/",
            "sortOrder": 10
          },
          {
            "title": "landing.gallery",
            "url": "https://www.landing.gallery/",
            "sortOrder": 11
          },
          {
            "title": "Supahero",
            "url": "https://www.supahero.io/",
            "sortOrder": 12,
            "description": "精心挑选的落地页"
          },
          {
            "title": "Mobbin",
            "url": "https://mobbin.com/",
            "sortOrder": 13,
            "description": "UI/UX参考库"
          },
          {
            "title": "saaslandingpage.com",
            "url": "https://saaslandingpage.com/",
            "sortOrder": 14,
            "description": "sass 登录页"
          }
        ]
      },
      {
        "title": "平台/工具",
        "sortOrder": 1,
        "bookmarks": [
          {
            "title": "Canva",
            "url": "https://www.canva.com/",
            "sortOrder": 0
          },
          {
            "title": "Affinity",
            "url": "https://www.affinity.studio/",
            "sortOrder": 1
          },
          {
            "title": "MasterGo",
            "url": "https://mastergo.com/",
            "sortOrder": 2
          },
          {
            "title": "Figma",
            "url": "https://www.figma.com/",
            "sortOrder": 3
          },
          {
            "title": "Framer",
            "url": "https://www.framer.com/",
            "sortOrder": 4
          }
        ]
      }
    ]
  },
  {
    "title": "其它资源",
    "sortOrder": 7,
    "stagger": true,
    "cards": [
      {
        "title": "资源集合",
        "sortOrder": 0,
        "bookmarks": [
          {
            "title": "中州韵输入法引擎",
            "url": "https://rime.im/",
            "sortOrder": 0
          },
          {
            "title": "识典古籍",
            "url": "https://www.shidianguji.com/",
            "sortOrder": 1
          },
          {
            "title": "汉语国学",
            "url": "https://www.hanyuguoxue.com/",
            "sortOrder": 2
          },
          {
            "title": "字统网",
            "url": "https://zi.tools/",
            "sortOrder": 3
          },
          {
            "title": "freemediaheckyeah",
            "url": "https://fmhy.net/",
            "sortOrder": 4,
            "badgeText": "hot",
            "badgeVariant": "hot"
          },
          {
            "title": "PICK FREE",
            "url": "https://www.pickfree.cn/",
            "sortOrder": 5
          },
          {
            "title": "鹏少资源网",
            "url": "https://www.jokerps.com/",
            "sortOrder": 6
          },
          {
            "title": "hereitis",
            "url": "https://www.hereitis.cn/",
            "sortOrder": 7
          },
          {
            "title": "Toolfolio",
            "url": "https://toolfolio.io/",
            "sortOrder": 8
          }
        ]
      },
      {
        "title": "逐新趣异",
        "sortOrder": 1,
        "bookmarks": [
          {
            "title": "TrustMRR",
            "url": "https://trustmrr.com/",
            "sortOrder": 0,
            "description": "已验证初创企业收入数据库"
          },
          {
            "title": "Wayback Machine",
            "url": "https://web.archive.org/",
            "sortOrder": 1,
            "description": "互联网档案馆"
          },
          {
            "title": "ClipDrop",
            "url": "https://clipdrop.co/",
            "sortOrder": 2,
            "description": "创建令人惊叹的视觉效果"
          },
          {
            "title": "Layoutit",
            "url": "https://layoutit.com/",
            "sortOrder": 3
          },
          {
            "title": "Hackreels",
            "url": "https://www.hackreels.com/",
            "sortOrder": 4
          },
          {
            "title": "Pathfinding Visualizer",
            "url": "https://pathfinding-visualizer-nu.vercel.app/",
            "sortOrder": 5
          },
          {
            "title": "tree.fm",
            "url": "https://www.tree.fm/",
            "sortOrder": 6,
            "description": "倾听来自世界各地的森林之声"
          },
          {
            "title": "WebCheck",
            "url": "https://web-check.xyz/",
            "sortOrder": 7,
            "description": "一款功能强大的网站分析工具"
          },
          {
            "title": "workout-cool",
            "url": "https://workout.cool/",
            "sortOrder": 8,
            "description": "🏋️‍♂️ 现代开源健身教练平台"
          }
        ]
      },
      {
        "title": "手机软件",
        "sortOrder": 2,
        "bookmarks": [
          {
            "title": "多邻国",
            "url": "https://www.duolingo.cn/",
            "sortOrder": 0
          },
          {
            "title": "新华字典",
            "url": "https://www.cp.com.cn/digital/app.html",
            "sortOrder": 1
          },
          {
            "title": "微信读书",
            "url": "https://weread.qq.com/",
            "sortOrder": 2
          },
          {
            "title": "万词王",
            "url": "https://www.perfectlingo.com/",
            "sortOrder": 3
          },
          {
            "title": "OurPlay",
            "url": "https://www.ourplay.net/",
            "sortOrder": 4,
            "description": "商店或通过公众号下载"
          }
        ]
      }
    ]
  }
]
