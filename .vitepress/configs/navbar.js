export default [
    // {
    //     text: "首页",
    //     link: "/",
    // },
    {
        text: "书签",
        link: "/bookmarks/",
    },
    {
        text: "博客",
        items: [
            {
                text: "CSS 笔记",
                link: "/blog/css/",
            },
            {
                text: "JS 笔记",
                link: "/blog/javascript/",
            },
            {
                text: "命令相关",
                link: "/blog/order/",
            },
            {
                text: "插件相关",
                link: "/blog/plugin/",
            },
            {
                text: "开发问题",
                link: "/blog/questions/dev-QA",
            },
            {
                text: "其他整理",
                link: "/blog/others/windows 系统工作环境",
            },
        ],
        activeMatch: `^/blog/`,
    },

    {
        text: '练习',
        items: [
            {
                text: 'demo 练习',
                items: [
                    { text: 'vue3-todo-list', link: 'https://github.com/wwlight/vue3-todo-list' },
                    { text: 'pyramid-table', link: 'https://github.com/wwlight/pyramid-table' },
                ]
            },
        ]
    },
    {
        text: "关键字",
        link: "/keywords/",
    },
];
