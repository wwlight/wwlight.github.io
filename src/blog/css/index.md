# CSS 笔记

::: tip 学习资料

- [State of CSS](https://stateofcss.com/zh-hans/)
- [CSS 专业技巧](https://github.com/AllThingsSmitty/css-protips/tree/master/translations/zh-CN)
- [You-need-to-know-css](https://lhammer.cn/You-need-to-know-css/#/zh-cn/)
- [CSS Inspiration--CSS 灵感](https://chokcoco.github.io/CSS-Inspiration/)
- [CSS Tricks](https://qishaoxuan.github.io/css_tricks/)

:::

## 空元素设置占位符

```css
:empty::before {
   content: "-";
}
```
## 文本省略号

```css
/* 单行文本 */
p {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 多行文本 */
p {
    display: -webkit-box;
    /* autoprefixer: off */ /* webpack 打包兼容问题 */
    -webkit-box-orient: vertical; /*设置方向*/
    /* autoprefixer: on */
    -webkit-line-clamp: 2; /*设置超过为省略号的行数*/
    overflow: hidden;
    word-break: break-all; /* 处理字母数字折行*/
}
```

## 去除行内元素左右间隙

- 父元素设置`font-size:0;`
- 元素设置`float: left;`
- 元素设置`display: table-cell;`

## 去除 img 底部间隙

- 父元素设置`font-size:0;`
- 元素设置`vertical-align: bottom;`
- 元素设置`display: block;`或者`display: flex;`

## 纯英文、数字文本自动换行

- 元素设置`word-break: break-all;`[链接](https://mdn.io/zh/word-break)

## 针对全局样式覆盖问题

- 对当前影响元素设置`color: unset;`[链接](https://mdn.io/zh/unset)

## 平滑滚动

- 元素设置`scroll-behavior: smooth;`[链接](https://mdn.io/zh/scroll-behavior)
- js 实现`element.scrollIntoView({behavior: "smooth"});`[链接](https://mdn.io/zh/scrollIntoView)

## 事件穿透

- 元素设置`pointer-events:none;`[链接](https://mdn.io/zh/pointer-events)

## 移动端1像素问题
```css
::before {
  box-sizing: border-box;
  content: "";
  pointer-events: none;
  position: absolute;
  right: -50%;
  top: -50%;
  bottom: -50%;
  left: -50%;
  transform: scale(0.5);
  transform-origin: center;
  border: 1px solid red;
  overflow: hidden;
}
```
