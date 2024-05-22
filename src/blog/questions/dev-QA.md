# 问题记录

## 电脑关联多仓库

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


## 本地调试 npm 模块

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

## OpenSSL SSL_read: Connection was reset, errno 10054
::: warning 原因：
这是服务器的 SSL 证书没有经过第三方机构的签署，所以报错。可全局执行：
:::

```sh
# 关闭 Git 在 https 连接时对服务器证书的验证
$ git config --global http.sslVerify "false"
```

## fatal: refusing to merge unrelated histories 解决

```sh
# 允许不相关历史提交，强制合并，然后本地处理冲突之后再进行提交
$ git pull origin master --allow-unrelated-histories

$ git pull --allow-unrelated-histories

$ git merge master --allow-unrelated-histories
```

## husky > npm run -s precommit (node v10.xx.xx)

```sh
$ git commit -m "提交页面备注" --no-verify
```

## 代码回滚误操作如何恢复
- 代码有进行`commit`操作
```sh
# 回滚上一个版本（删除工作空间的改动代码，撤销commit且撤销add）
$ git reset --hard HEAD^

# 如何恢复删除的代码
$ git reflog
$ git reset --hard [hash]
```
- 代码没有`commit`，但进行了`git add .`，解决方法参考[链接](https://juejin.cn/post/6844903602981601294)

## 出现 git 提交冲突场景

```sh
# pull 和 push 同时存在
$ git pull --rebase
$ git rebase --continue

# 撤销 rebase 操作
$ git rebase --abort
```
