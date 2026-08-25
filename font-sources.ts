import type { FontSource } from './modules/font-subset'

// 分包字体的原始 ttf 来源清单（单一数据源，按需下载，不入库）
// family: @font-face 字体名；多字重需用不同名（同名会被 vite-plugin-font 合并）
// dir:    输出目录，可含字重子目录，如 lxgw/regular
export const fontSources: FontSource[] = [
  {
    name: 'LXGWWenKai-Regular.ttf',
    url: 'https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Regular.ttf',
    family: 'LXGW WenKai',
    dir: 'lxgw/regular'
  },
  {
    name: 'LXGWWenKai-Light.ttf',
    url: 'https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Light.ttf',
    family: 'LXGW WenKai Light',
    dir: 'lxgw/light'
  },
  {
    name: 'LXGWWenKai-Medium.ttf',
    url: 'https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Medium.ttf',
    family: 'LXGW WenKai Medium',
    dir: 'lxgw/medium'
  },
  {
    name: 'ZCOOLKuaiLe-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/zcoolkuaile/ZCOOLKuaiLe-Regular.ttf',
    family: 'ZCOOL KuaiLe',
    dir: 'zcool'
  },
  {
    name: 'FiraCode.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/firacode/FiraCode%5Bwght%5D.ttf',
    family: 'Fira Code',
    dir: 'fira-code'
  },
  {
    name: 'KingHwa_OldSong.ttf',
    url: 'https://raw.githubusercontent.com/KonghaYao/chinese-free-web-font-storage/branch/packages/jhlst/fonts/%E4%BA%AC%E8%8F%AF%E8%80%81%E5%AE%8B%E4%BD%93v2.002.ttf',
    family: 'KingHwa_OldSong',
    dir: 'jhlst'
  },
  {
    name: 'Huiwen-mincho.ttf',
    url: 'https://raw.githubusercontent.com/KonghaYao/chinese-free-web-font-storage/branch/packages/hwmct/fonts/%E6%B1%87%E6%96%87%E6%98%8E%E6%9C%9D%E4%BD%93.ttf',
    family: 'Huiwen-mincho',
    dir: 'hwmct'
  },
  {
    name: 'STDongGuanTi.ttf',
    url: 'https://raw.githubusercontent.com/KonghaYao/chinese-free-web-font-storage/branch/packages/stdgt/fonts/%E4%B8%8A%E5%9B%BE%E4%B8%9C%E8%A7%82%E4%BD%93-%E5%B8%B8%E8%A7%84.ttf',
    family: 'STDongGuanTi',
    dir: 'stdgt/regular'
  },
  {
    name: 'STDongGuanTi-Bld.ttf',
    url: 'https://raw.githubusercontent.com/KonghaYao/chinese-free-web-font-storage/branch/packages/stdgt/fonts/%E4%B8%8A%E5%9B%BE%E4%B8%9C%E8%A7%82%E4%BD%93-%E7%B2%97%E4%BD%93.ttf',
    family: 'STDongGuanTi Bld',
    dir: 'stdgt/bold'
  },
  {
    name: 'STDongGuanTi-Light.ttf',
    url: 'https://raw.githubusercontent.com/KonghaYao/chinese-free-web-font-storage/branch/packages/stdgt/fonts/%E4%B8%8A%E5%9B%BE%E4%B8%9C%E8%A7%82%E4%BD%93-%E7%BB%86%E4%BD%93.ttf',
    family: 'STDongGuanTi Light',
    dir: 'stdgt/light'
  },
  {
    name: 'LXGWBright-Light.ttf',
    url: 'https://raw.githubusercontent.com/KonghaYao/chinese-free-web-font-storage/branch/packages/lxgwwenkaibright/fonts/LXGWBright-Light.ttf',
    family: 'LXGW Bright Light',
    dir: 'lxgwbright/light'
  },
  {
    name: 'LXGWBright-Regular.ttf',
    url: 'https://raw.githubusercontent.com/KonghaYao/chinese-free-web-font-storage/branch/packages/lxgwwenkaibright/fonts/LXGWBright-Regular.ttf',
    family: 'LXGW Bright',
    dir: 'lxgwbright/regular'
  },
  {
    name: 'LXGWBright-Medium.ttf',
    url: 'https://raw.githubusercontent.com/KonghaYao/chinese-free-web-font-storage/branch/packages/lxgwwenkaibright/fonts/LXGWBright-Medium.ttf',
    family: 'LXGW Bright Medium',
    dir: 'lxgwbright/medium'
  }
]
