# mac 系统工作环境

:::info 工欲善其事，必先利其器。
:::

## ℹ️ 说明

- 省事方式：可借助 [Mac 迁移助理](https://support.apple.com/zh-cn/102613) 进行快速同步
- ✅：免费｜推荐
- ❎：收费｜了解｜科学

## 🍀 准备工作

- ✅ ️[Google Chrome](https://pc.qq.com/detail/1/detail_2661.html)【[官网](https://www.google.com/intl/zh-CN/chrome/)】- 一切事情的开始
   - 登录账号同步数据
- ❎️ [Ghelper](https://ghelper.net/) - 浏览器插件，安全科学上网的第一步
   - 登录账号开通会员，开启新世界的大门
- ✅ 字体安装
   - [Nerd Fonts](https://www.nerdfonts.com/font-downloads) - 修补了具有大量字形（图标）的开发人员目标字体
   - 搜索下载 `FiraCode Nerd Font`
- ✅ [Homebrew](https://brew.sh/) - 软件包的管理器｜[镜像](https://gitee.com/cunkai/HomebrewCN)
- ️❎️ [Applite](https://aerolite.dev/applite/index.html) - 简化使用 Homebrew 的第三方应用程序的安装和管理
- ✅ [SwitchHosts](https://switchhosts.vercel.app/zh) - 是一个管理、切换多个 hosts 方案的工具
   - [GitHub Hosts](https://ineo6.github.io/hosts/) - GitHub 最新 hosts

## ✍🏻 终端配置

- ✅️ [Hyper](https://hyper.is/) - 是一款跨平台的终端软件
   - [awesome-hyper](https://github.com/bnb/awesome-hyper)
   - 配置文件位置：`~/Library/Application Support/Hyper/.hyper.js`
```bash
$ hyper install hyper-dracula
$ hyper install hyperborder
$ hyper install hyperpower
```

- ✅ [Starship](https://starship.rs/zh-CN/) - 轻量、迅速、客制化的高颜值终端
- zsh plugins：
   - [zdharma-continuum/fast-syntax-highlighting](https://github.com/zdharma-continuum/fast-syntax-highlighting)
   - [zsh-users/zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
   - [zsh-users/zsh-completions](https://github.com/zsh-users/zsh-completions)
   - [incr](https://mimosa-pudica.net/zsh-incremental.html)
- zsh settings：

::: details .zshrc 配置文件

```bash
# ~/.zshrc
export PATH=$HOME/.npm_global/bin:/usr/local/mysql/bin:$PATH

# zsh
export ZSH=$HOME/.zsh
export ZSH_COMPDUMP=$ZSH/cache/.zcompdump-$HOST
HISTFILE=$HOME/.zsh_history
HISTSIZE=5000
SAVEHIST=5000
HISTDUP=erase
setopt appendhistory
setopt sharehistory
setopt incappendhistory
setopt hist_ignore_all_dups
setopt hist_save_no_dups
setopt hist_ignore_dups
setopt hist_find_no_dups

# zsh plugins
source $ZSH/plugins/fast-syntax-highlighting/fast-syntax-highlighting.plugin.zsh
source $ZSH/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source $ZSH/plugins/incr/incr.plugin.zsh
fpath=($ZSH/plugins/zsh-completions/src $fpath)
ZSH_AUTOSUGGEST_STRATEGY=(history completion)
ZSH_AUTOSUGGEST_BUFFER_MAX_SIZE=20
# plugins end

alias git=/opt/homebrew/bin/git
alias python=/usr/bin/python3
alias ping="gping"
alias of="onefetch"
alias nio="ni --prefer-offline"
alias s="nr start"
alias d="nr dev"
alias b="nr build"
alias z="zoxide"
alias cls="clear"
# Go to project root
alias grt='cd "$(git rev-parse --show-toplevel)"'
alias gp='git push'
alias gl='git pull'

# fnm
eval "$(fnm env --use-on-cd)"
# fnm end

# starship
eval "$(starship init zsh)"
export STARSHIP_CONFIG=~/.config/starship/starship.toml

function set_win_title(){
    echo -ne "\033]0; $(basename "$USER") \007"
}
starship_precmd_user_func="set_win_title"

precmd_functions+=(set_win_title)
# starship end

# zoxide
eval "$(zoxide init zsh)"
# zoxide end

# fzf
source <(fzf --zsh)
# fzf end
```
:::
- 参考资料：[Using ZSH without OMZ](https://dev.to/hbenvenutti/using-zsh-without-omz-4gch)

## 💻️ 开发工具

```bash
# 终端直接下载
$ brew install git
$ brew install gh
$ brew install bun
$ brew install nginx
$ brew install code-server
$ brew install gping
$ brew install onefetch
$ brew install fzf
$ brew install zoxide
$ brew install lazygit

# 终端直接下载或者在 Applite 进行下载
$ brew install --cask visual-studio-code
$ brew install --cask hbuilderx
$ brew install --cask applite
$ brew install --cask hyper
$ brew install --cask switchhosts
$ brew install --cask obsidian
$ brew install --cask android-studio
$ brew install --cask android-platform-tools
$ brew install --cask picgo
```

- ✅ [VS Code](https://code.visualstudio.com/)
   - 登录账号同步数据
- ✅ [Hbuilder X](https://www.dcloud.io/hbuilderx.html)
- ✅ [Android Studio](https://developer.android.com/studio?hl=zh-cn)

## 💻️ 开发环境

```sh
# 设置本地默认分支 main
$ git config --global init.defaultBranch main

# 设置文件大小写敏感
$ git config --global core.ignorecase false

# 忽略目录安全限制
$ git config --global --add safe.directory "*"
```

- ✅ [fnm](https://github.com/Schniz/fnm) - 快速简单的 Node.js 版本管理器，用 Rust 构建
```bash
# fnm 支持多项目单独切换版本
$ brew install fnm
$ echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
$ source ~/.zshrc

$ fnm ls
$ fnm ls-remote
$ fnm ls-remote | grep v20
$ fnm install --lts
$ fnm install --latest
$ fnm install  16.14.2
$ fnm install  14.16.0
$ fnm default X
$ fnm use X
$ fnm env

# 项目写入 node 版本
$ node --version > .node-version
```

- ✅ [Corepack](https://github.com/nodejs/corepack) - 允许您使用 Yarn、npm 和 pnpm，默认随 node 一起安装 （ v16.9.0+）
```bash
$ corepack -h
$ corepack enable

$ corepack install -g pnpm
$ corepack install -g yarn

# 切换 pnpm 最新版本
$ corepack use pnpm@latest
# 切换 pnpm 指定版本
$ corepack use pnpm@9.0.6
```

- 共享 npm 全局模块
```bash
$ mkdir -p ~/.npm_global
$ npm config set prefix ~/.npm_global

# 设置环境变量
$ echo "export PATH=~/.npm_global/bin:$PATH" >> ~/.zshrc
$ source ~/.zshrc

$ npm i -g @antfu/ni
```
## 💻️ 效率工具

- ✅ [微信键盘](https://z.weixin.qq.com/)
- ✅ [Arc](https://arc.net/) - 浏览器
- ✅ [iShot Pro](https://apps.apple.com/cn/app/ishot-pro-%E4%B8%93%E4%B8%9A%E7%9A%84%E6%88%AA%E5%9B%BE%E8%B4%B4%E5%9B%BE%E5%BD%95%E5%B1%8F%E5%BD%95%E9%9F%B3ocr%E7%BF%BB%E8%AF%91%E5%8F%96%E8%89%B2%E5%B7%A5%E5%85%B7/id1611347086?mt=12) - 专业的截图贴图录屏录音 OCR 翻译取色工具
- ✅ [右键助手专业版](https://apps.apple.com/cn/app/%E5%8F%B3%E9%94%AE%E5%8A%A9%E6%89%8B%E4%B8%93%E4%B8%9A%E7%89%88/id1555844307?mt=12) - 超丰富的右键菜单
- ❎ [Raycast](https://www.raycast.com/) - 一个为 mac 设计的高效生产力工具
- ❎ [CleanMyMac X](https://cleanmymac.com/) - mac 清洁应用程序
- ✅ [Kap](https://getkap.co/) - GIF 录制
- ✅ [The Unarchiver](https://theunarchiver.com/) - 解压工具
- ✅ [IINA](https://iina.io/) - 现代媒体播放器
- ✅ [ClashX Pro](https://github.com/yichengchen/clashX) - 简单轻量化的代理客户端
- ✅ [Obsidian](https://obsidian.md/) - 是一款私密且灵活的写作应用程序
- ✅ [Command X](https://sindresorhus.com/command-x) - 在 Finder 中剪切和粘贴文件
- ✅ [keycastr](https://github.com/keycastr/keycastr) - 一个开源的按键可视化工具
- ✅ [键指如飞](https://www.better365.cn/FlyKey.html)
- ✅ [Picture View](https://wl879.github.io/apps/picview/) - mac 图片浏览应用
- ✅ [PicGo](https://molunerfinn.com/PicGo/) - 图片上传+管理新体验
- ✅ [多邻国](https://apps.apple.com/cn/app/%E5%A4%9A%E9%82%BB%E5%9B%BDduolingo%E8%8B%B1%E8%AF%AD%E6%97%A5%E8%AF%AD%E6%B3%95%E8%AF%AD/id570060128) - 全球数亿语言学习者的口碑选择
- ✅ [万词王](https://apps.apple.com/cn/app/%E4%B8%87%E8%AF%8D%E7%8E%8B-%E8%A7%86%E9%A2%91%E8%83%8C%E5%8D%95%E8%AF%8D%E5%AD%A6%E8%8B%B1%E8%AF%AD%E5%BF%85%E5%A4%87app/id1464643633) - 视频背单词学英语必备APP
- ✅ [微信读书](https://apps.apple.com/us/app/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6/id952059546)
- ✅ [新华字典](https://apps.apple.com/cn/app/%E6%96%B0%E5%8D%8E%E5%AD%97%E5%85%B8-%E6%96%B0%E4%B8%AD%E5%9B%BD%E9%A2%87%E5%85%B7%E5%BD%B1%E5%93%8D%E5%8A%9B%E7%9A%84%E7%8E%B0%E4%BB%A3%E6%B1%89%E8%AF%AD%E5%AD%97%E5%85%B8/id1197209563)
- ❎ ️[Alfred](https://www.alfredapp.com/) - 效率神器
- ❎ [Scroll Reverser](https://pilotmoon.com/scrollreverser/) - 触摸板与鼠标滚动方向独立设置

## ♻️ 资源平台

- ✅ [macOSicons](https://macosicons.com/) - 更换 mac 应用图标
- ❎ [马可菠萝](https://www.macbl.com/) - 分享你喜欢的 mac 应用
- ❎ [MacApp分享频道](https://macapp.org.cn/)
