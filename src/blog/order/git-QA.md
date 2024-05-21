# Git 常见问题

## `001`\_电脑关联多仓库

::: warning
针对 mac 下操作，部分命令 windows 下不适用。
:::

> Git 客户端与服务器端的通信支持多种协议，其中 SSH 是最常用的。SSH 的公钥登录流程：用户将自己的公钥存储在远程主机，登录时，远程主机会向用户发送一条消息，用户用自己的私钥加密后，再发给服务器。远程主机用事先存储的公钥进行解密，如果成功，就证明用户可信。

- **第一步：进入.ssh 文件**

```sh
$ cd ~/.ssh
```

> 如果报错： `no such file or directory: /Users/<电脑名称>/.ssh` 表示电脑没有配置过；<br/>
> 如果是进入到了相应的文件夹内并且不是自己配置的，建议删除里面文件， 怎么删除？ `rm -rf *` 但是一定要确认当前是在.ssh 文件夹下，不然千万千万不要执行 `rm -rf *`。

- **第二步：本地生成 GitLab 和 GitHub 的 SSH**

```sh
$ ssh-keygen -t rsa -C "注册 GitLab 账户的邮箱"  # 生成ssh key

$ ssh-keygen -t rsa -C "注册 GitHub 账户的邮箱"   # 生成ssh key
```

::: warning
生成 ssh key 命令回车后，需要对 `秘钥` 保存地址进行自定义设置，后面 passphrase 密码可以直接忽略。<br/>

- GitLab 对应的 `秘钥（gitlab_id_rsa）` 地址可设置：`~/.ssh/gitlab_id_rsa`;
- GitHub 对应的 `秘钥（github_id_rsa）` 地址可设置：`~/.ssh/github_id_rsa`。

:::

> 桌面<kbd>&ensp;⌘&ensp;</kbd> + <kbd>F</kbd>在“访达”窗口中开始“聚焦”搜索，找到<电脑名称>根文件，<kbd>&ensp;⌘&ensp;</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> 切换隐藏的文件，找到 .ssh 文件，可以看到：

![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-e6c75593224a860ad9e8023832dc6b6f-f8c532.png)

- **第三步：将公钥分别配置到 GitLab 和 GitHub 的 ssh keys 中**

::: tip 设置 ssh keys

可根据以下步骤将 `公钥` 分别粘贴配置到对应 ssh keys 中：

- **GitLab**：
  - 我的头像`==>`Settings`==>`SSH keys`==>`Add key
- **GitHub**：
  - 我的头像`==>`Settings`==>`SSH and GPG keys`==>`New SSH key`==>`Add SSH key

:::

```sh
$ cd ~/.ssh
$ ls                      # 查看文件夹下有哪些文件
$ cat id_rsa.pub          # 回车 将输出的内容复制下来
$ cat github_id_rsa.pub   # 回车 将输出的内容复制下来
```

- **第四步：编写 config 文件**

> 本地调用私钥时默认使用 id_rsa，针对于自定义名称的，需要编写 config 文件，告诉本地调用哪个私钥。

```sh
# 创建 config 文件
$ touch ~/.ssh/config
```

```md
# config 文件内容

Host github.com
HostName github.com
User 任意名称
IdentityFile ~/.ssh/github_id_rsa
```

- **第四步：验证是否配置成功**

```sh
# GitLab：
$ ssh -T git@xxx.com
# GitHub:
$ ssh -T git@github.com
```

> 输入 yes 后在`.ssh`目录下就多了一个文件`known_hosts`

![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-83cdaef2ea236a41817975d87c198373-fdfa1e.png)
![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-ccff47a01358709b1d426c0b0c2fce32-35c48b.png)

> 参考资料：[在一台电脑上同时关联 GitLab 和 GitHub](https://blog.csdn.net/litianxiang_kaola/article/details/79485680)

::: danger 如遇报错
ssh: connect to host github.com port 22: Connection timed out

##### 方式一：更改`config`文件（不一定好使）
``` md
Host github.com
User git
Hostname ssh.github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
Port 443
```
> 参考资料：[Git问题：解决“ssh:connect to host github.com port 22: Connection timed out”](https://blog.csdn.net/weixin_41287260/article/details/124368189)

##### 方式二：修改本地`host`文件（推荐）
- 终端 `ping github.com` 不同；
- 打开`C:\Windows\System32\drivers\etc\hosts`，末尾添加：
```md
192.30.255.112  github.com git
185.31.16.184 github.global.ssl.fastly.net
```
- 重新尝试：`ssh -T git@github.com`
> 参考资料：[解决GitHub.com无法访问，连接超时的问题](https://www.cnblogs.com/aoshilin/p/14536260.html)
[git各种异常问题整理](https://www.pudn.com/news/63009ebf5425817ffc703b50.html)

:::

::: danger 如遇报错
- Command failed with exit code 128.
- git config --global --add safe.directory XXX

```sh
$ git config --global --add safe.directory "*"
```

> 参考资料：[git报错 fatal: unsafe repository](https://www.aspirantzhang.com/network/git-fatal-unsafe-repository.html)
:::

::: danger 如遇报错
Unable to negotiate with xxxxx port 22: no matching host key type found.

- 在`config`文件中添加
```md
Host *
HostkeyAlgorithms +ssh-rsa
PubkeyAcceptedKeyTypes +ssh-rsa
```
> 参考资料：[Unable to negotiate with xxxxx port 22: no matching host key type found. Their offer: ssh-rsa报错的解决方法](https://blog.csdn.net/oqqLWX/article/details/122305908)
:::


## `002`\_本地调试 npm 模块

::: warning
在组件依赖开发中，项目作为依赖库没法独自间接运行，须要依赖进别的方式执行，这时候最常用的形式就是 npm link。但用 npm link 引入的依赖因为资源文件不在我的项目下，webpack 不会对其做预编译，导致构建或者运行时会报错。对于这样的状况，可以考虑一个很适宜的解决方案 —— yalc。

- [yalc](https://github.com/wclr/yalc)
- [关于前端:更适用的前端 link 工具-yalc](https://lequ7.com/guan-yu-qian-duan-geng-shi-yong-de-qian-duan-link-gong-ju-yalc.html)

:::

- **第一步：本地 link 模块**

  - 模块 package.json 添加个人信息，开启编辑权限
  - 模块打包和运行

  ```sh
  $ npm run build                    # 打包
  # 模块（线上组件）运行
  $ npm run lib
  $ npm run lib:hot                  # 热更新

  # 相关命令配置
  "lib": "rm -rf lib && babel src -d lib --copy-files",
  "lib:hot": "babel src -d lib --copy-files --watch",
  ```

  - link 模块

  ```sh
  # 项目和模块相同目录 或者 模块文件名和模块名一致的情况
  $ npm link <本地模块绝对路径>         # 链接模块目录

  # 项目和模块不在同一个目录下，需要先把模块链接到全局，然后再在项目中链接模块
  $ cd <模块目录>                      # 先去到模块目录，把它链接到全局
  $ npm link

  $ cd <项目目录>                      # 再去项目目录
  $ npm link <module-name>            # 通过包名建立链接
  ```

  - 解除链接

  ```sh
  # 解除项目和模块的链接
  $ cd <项目目录>
  $ npm unlink <module-name>

  # 解除模块的全局链接
  $ cd <模块目录>
  $ npm unlink <module-name>
  # unlink 后会删除 package.json 里面包依赖信息，需重新下载最新指定版本的包
  ```

- **第二步：进行本地开发调试**

- **第三步：打包发布 npm 包**
  - 打包前修改 package.json 里面的版本号

  ```sh
  $ npm run build                       # 打包
  $ npm publish --tag=beta              # 测试版
  $ npm publish                         # 正式版

  # 如有需要
  $ npm add user
  $ npm login
  ```

> 可参考：[NPM-的 adduser - 腾讯云](https://cloud.tencent.com/developer/section/1490273) &#X3000; [本地调试 npm 模块 —— npm link](https://www.jianshu.com/p/82076fc481a6)

## `003`\_windows 中 nvm 的安装教程

::: tip 说明
`nvm` 作为 `nodejs` 版本管理工具，可通过它安装和快速切换不同版本的 `nodejs`，保持系统的干净。
想安装或者之前电脑安装过 `nodejs` 的同学，建议先把所有相关文件夹和环境变量删除干净，不用担心环境变量配置，本教程方法会自动添加好环境变量，方便使用。
:::

#### 一、nvm 下载

GitHub 地址：[nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-664c58796d8b0166951242fc4070fed7-b10add.png)

#### 二、自定义安装

我选择了安装 D 盘，先创建 Nvm 文件夹，然后在 Nvm 里面创建空的 nodejs 文件夹，如图：
![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-4559ec0737420c81a49264550a337ed9-632152.png)

1.  点击 nvm-setup.exe ，选择自定义安装路径，指向刚创建的 Nvm 文件夹；
    ![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-b6e6b34d1cd8f069ad11dec917fc272c-d195ea.png)
2.  点击 next ，选择路径设置环境变量，路径指向 Nvm 文件夹下的 nodejs 文件夹；
    ![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-0a08d22eb2cab2aa95257f38eac75cd4-3d140f.png)
3.  环境变量路径选好，next 然后 install 进行安装，很快就能安装完成（之前的 nodejs 空文件夹会被清除）。安装好的目录如图：
    ![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-1761360e66ea04f41840ac78f627c5ce-76caa7.png)
    ![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-485679500592b759f99e46458fd67b19-ee422b.png)
4.  检查是否安装成功 ，任意地方打开 cmd 面板，输入 `nvm -v` 出现如图所示则安装成功；
    ![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-22-b98ef50fc9c532aa02af5e92998fd565-4ec36b.png)
5.  nvm 常用指令

```sh
# 查看版本
$ nvm -v

# 查看安装的 nodejs 版本
$ nvm ls

# 安装指定版本的 nodejs
$ nvm install <version>

# 卸载指定版本的 nodejs
$ nvm uninstall <version>

# 使用指定版本的 nodejs
$ nvm use <version>
```

#### 三、安装 nodejs

1. 最新版 nvm 1.1.5 以上，直接用命令设置国内镜像（先设置好，方便 nodejs 各版本安装）。[npmmirror 中国镜像站](https://npmmirror.com/)

```sh
$ nvm node_mirror https://npmmirror.com/mirrors/node/
$ nvm npm_mirror https://npmmirror.com/mirrors/npm/
```

2. 可通过[链接](https://nodejs.org/dist/)查看 nodejs 历史版本，然后安装指定版本 nodejs。

```sh
$ nvm install 16.14.2
$ nvm install 14.5.0
$ nvm install 12.18.2
$ nvm install latest
```

![](https://s1.ax1x.com/2022/04/01/q4YY3n.png)

3. 通过 `nvm use <version>` 使用已安装过的版本（此时 Nvm 文件夹下会生成当前使用的 nodejs 版本文件）。

![](https://s1.ax1x.com/2022/04/01/q4YWDK.png)

到此如上图所示我们的 nvm 和 nodejs 版本切换都可以正常使用了。

::: danger 注意

- 下载的不同版本 nodejs ,所安装的依赖是相互独立的，为保证同步，需要在不同版本中都安装对应的依赖。
- 需要注意的一点是，通过（`nvm use <version>`）切换版本的时候，可能会出现不成功，这个时候我们需要确保 Nvm 文件夹下有这个 nodejs 空文件夹，且在管理员身份下执行命令。这个文件夹 一是为了对应之前设置的 nodejs 环境变量地址，二是为了存放当前要使用的 nodejs 版本。
  :::

#### 四、其他依赖安装和设置

1. [cnpm 安装](http://www.npmmirror.com/?spm=a2c6h.14029880.0.0.735975d7y8fk0w)

```sh
$ npm install -g cnpm --registry=https://registry.npmmirror.com
```

2. [yarn 安装](https://www.yarnpkg.cn/getting-started/install)

```sh
$ npm install -g yarn
# 或
$ cnpm install -g yarn
```

npm 和 yarn 镜像设置

```sh
# npm 设置

# 查询当前镜像
$ npm get registry

# 设置为淘宝镜像
$ npm config set registry https://registry.npmmirror.com/

#设置为官方镜像
$ npm config set registry https://registry.npmjs.org/

# yarn 设置

# 查询当前镜像
$ yarn config get registry

# 设置为淘宝镜像
$ yarn config set registry https://registry.npmmirror.com

# 设置为官方镜像
$ yarn config set registry https://registry.yarnpkg.com/
```

3. [rimraf 安装](https://www.npmjs.com/package/rimraf)

```sh
$ npm install rimraf -g
```

4. [typescript 安装](https://www.tslang.cn/index.html#download-links)

```sh
$ npm install -g typescript
# 编译
$ tsc helloworld.ts

# ts-node直接运行typescript文件
$ npm install -g ts-node
```

5. vue 生态安装（[@vue/cli](https://cli.vuejs.org/zh/guide/installation.html)）

```sh
$ npm install -g @vue/cli
# 或
$ yarn global add @vue/cli

# 升级
$ npm update -g @vue/cli
# 或者
$ yarn global upgrade --latest @vue/cli

# 创建项目
$ vue create hello-world

# 使用图形化界面
$ vue ui
```

6. react 生态安装（[react](https://www.html.cn/create-react-app/docs/getting-started/)、[dva-cli](https://dvajs.com/guide/getting-started.html#%E5%AE%89%E8%A3%85-dva-cli)）

```sh
# react 项目创建的几种方式

# npx 来自 npm 5.2+ 或更高版本
$ npx create-react-app my-app

# npm
$ npm init react-app my-app

# yarn
$ yarn create react-app my-app


# 下载 dva-cli
$ npm install dva-cli -g

# 创建项目
$ dva new dva-quickstart
```

7. live-server 安装

```sh
$ npm install live-server -g
```

8. gulp 安装（[gulp-cli](https://www.gulpjs.com.cn/docs/getting-started/quick-start/)）

```sh
$ npm install --global gulp-cli
# 或
$ npm install gulp-cli -g

# 项目中安装
$ npm install gulp -D
```

#### 五、其他问题
- mac 下安装 [nvm](https://github.com/nvm-sh/nvm)

> 关于 yarn : 无法加载文件 D:\DevelopmentApplication\Nvm\nodejs\yarn.ps1，因为在此系统上禁止运行脚本（cmd、Git Bash Here 运行正常，PowerShell 出错）。
>
> <p>问题处理办法：<span  style="color:red;">以管理员身份运行 PowerShell，执行以下命令。</span></p>

```sh
# 查看
$ get-ExecutionPolicy
# 设置
$ set-ExecutionPolicy RemoteSigned
```

![](https://cdn.jsdelivr.net/gh/wwlight/pbd/website/2023-04-23-cf6d50f9139937105bc45e031d55cc6d-c997da.png)

#### 六、参考文章

- [windows、Linux 下 nvm 和，nodejs，Yarn 安装使用](https://my.oschina.net/summerdays/blog/835233)
- [win10 安装 nvm 管理 node 版本，以及环境配置和遇到的坑(‘node’ 和’npm’不是内部或外部命令，也不是可运行的程序 或批处理文件。)](https://blog.csdn.net/sxs7970/article/details/102644705)
- [Yarn 和 NPM 国内快速镜像（淘宝镜像）](https://www.jianshu.com/p/1dae26594ce5)

## `004`\_Mac 包管理器 n 的安装教程

> 安装方式[官网](https://github.com/tj/n)
1. 已安装`node`

```sh
$ npm i -g n
```
2. 通过 [Homebrew](https://brew.sh/index_zh-cn) 安装
```sh
$ brew install n
```
3. n 常用命令
```sh
# 操作失败，命令前加 sudo
# 查看版本
$ n -V
# 查看安装 nodejs 版本
$ n ls
# 安装指定版本 nodejs
$ n <version>
# 删除指定版本 nodejs
$ n rm <version>
# 使用指定版本 nodejs（出现选项，上下切换回车）
$ n
# 查看版本路径
$ n which <version>
```
4. 常用版本下载
```sh
$ n lts
$ n 16.14.2
$ n 14.5.0
```
5. 下载镜像源管理工具 [nrm](https://www.npmjs.com/package/nrm)
```sh
$ npm i -g nrm
$ nrm ls
$ nrm use cnpm
```

## `005`\_OpenSSL SSL_read: Connection was reset, errno 10054

::: warning 原因：
这是服务器的 SSL 证书没有经过第三方机构的签署，所以报错。可全局执行：
:::

```sh
$ git config --global http.sslVerify "false"
```

## `006`\_fatal: refusing to merge unrelated histories 解决

```sh
# 允许不相关历史提交，强制合并，然后本地处理冲突之后再进行提交
$ git pull origin master --allow-unrelated-histories

$ git pull --allow-unrelated-histories

$ git merge master --allow-unrelated-histories
```

## `007`\_husky > npm run -s precommit (node v10.xx.xx)

```sh
$ git commit -m "提交页面备注" --no-verify
```

## `008`\_代码回滚误操作如何恢复
- 代码有进行`commit`操作
```sh
# 回滚上一个版本（删除工作空间的改动代码，撤销commit且撤销add）
$ git reset --hard HEAD^

# 如何恢复删除的代码
$ git reflog
$ git reset --hard [hash]
```
- 代码没有`commit`，但进行了`git add .`，解决方法参考[链接](https://juejin.cn/post/6844903602981601294)
