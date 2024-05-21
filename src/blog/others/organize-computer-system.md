# 电脑系统相关整理


## 查看 IP 地址
- `window`中在 cmd 中输入
```sh
$ ipconfig
```
- `mac` 中在 cmd 中输入
```sh
$ ifconfig
```

## 截图快捷键
- `Print Screen`截取全屏并保存在剪切板，在编辑器、文件夹、聊天窗口粘贴使用；（适合应用在截取右键菜单、快捷键导致鼠标菜单失效情况）
- `Win + Print Scree`截取全屏并自动保存到 **"此电脑>视频>捕获"** 目录下；
- `Win + Shift + S`调取系统截图工具，在编辑器、文件夹、聊天窗口粘贴使用；

## 本地 IIS 服务开启与启动
- [https://www.cnblogs.com/teyigou/p/8125379.html](https://www.cnblogs.com/teyigou/p/8125379.html)
- 打开IIS管理器， win + R 输入 inetmgr
- 本地访问地址：`http://localhost:8099/`、`http://172.16.9.209:8099/`
- [iis配置，其他电脑无法访问](https://jingyan.baidu.com/article/fb48e8be39ca736e622e1427.html)

## windows 配置本地 hosts
- `Win+R`打开运行框，然后键入`hosts`文件路径：`C:\WINDOWS\system32\drivers\etc`
- [windows配置本地hosts](https://blog.csdn.net/weixin_58942821/article/details/120669937)

## Win10 快捷键

> 参考资料：[【官方】Windows 的键盘快捷方式](https://support.microsoft.com/zh-cn/windows/windows-%E7%9A%84%E9%94%AE%E7%9B%98%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F-dcc61a57-8ff0-cffe-9796-cb9706c75eec)

| 功能 | 快捷键 |
| :- | :- |
| Win10 颜色筛选器功能，黑白色切换 | <kbd>Windows</kbd> + <kbd>Ctrl</kbd> + <kbd>C</kbd> |
| 电脑桌面关机/退出应用 | <kbd>Alt</kbd> + <kbd>F4</kbd>（+ <kbd>Fn</kbd>） |
| 鼠标右键 | <kbd>Shift</kbd> + <kbd>F10</kbd>（+ <kbd>Fn</kbd>） |
| 永久删除所选项 | <kbd>Shift</kbd> + <kbd>Delete</kbd> |
| 电脑快速重新启动 | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Delete</kbd> |
| 打开任务管理器 | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Esc</kbd> |
| 电脑锁屏 | <kbd>Windows</kbd> + <kbd>L</kbd> |
| 电脑打开“我的电脑” | <kbd>Windows</kbd> + <kbd>E</kbd> |
| 返回电脑桌面 | <kbd>Windows</kbd> + <kbd>D</kbd> |
| 电脑窗口切换 | <kbd>Windows</kbd> + <kbd>Tab</kbd> |
| 电脑快捷视图 | <kbd>Windows</kbd> + <kbd>X</kbd> |
| 电脑放大镜功能 | <kbd>Windows</kbd> + <kbd>+</kbd> |
| 打开录像 | <kbd>Windows</kbd> + <kbd>R</kbd>，输入 psr.exe |
| 打开虚拟键盘 | <kbd>Windows</kbd> + <kbd>R</kbd>，输入 osk |
| 查看系统版本 | <kbd>Windows</kbd> + <kbd>R</kbd>，输入 winver |

## Mac 快捷键

> 参考资料：[【官方】Mac 键盘快捷键](https://support.apple.com/zh-cn/HT201236) 、[《macOS 使用手册》](https://support.apple.com/zh-cn/guide/mac-help/welcome/mac)

| 功能 | 快捷键 |
| :- | :- |
| 查找文稿中的项目或打开“查找”窗口 | <kbd>&ensp;⌘&ensp;</kbd> + <kbd>F</kbd> |
| 从“访达”窗口进行“聚焦”搜索 （同上）| <kbd>&ensp;⌘&ensp;</kbd> + <kbd>Option</kbd> + <kbd>空格</kbd> |
| 隐藏最前面的应用的窗口 | <kbd>&ensp;⌘&ensp;</kbd> + <kbd>H</kbd> |
| 将最前面的窗口最小化至“程序坞” | <kbd>&ensp;⌘&ensp;</kbd> + <kbd>M</kbd> |
| 打开所选项 | <kbd>&ensp;⌘&ensp;</kbd> + <kbd>O</kbd> |
| 打开新标签页 | <kbd>&ensp;⌘&ensp;</kbd> + <kbd>T</kbd> |
| 关闭最前面的窗口 | <kbd>&ensp;⌘&ensp;</kbd> + <kbd>W</kbd> |
| 关闭应用的所有窗口 | <kbd>Option</kbd> + <kbd>&ensp;⌘&ensp;</kbd> + <kbd>W</kbd> |
| 显示或隐藏“聚焦”搜索栏 | <kbd>&ensp;⌘&ensp;</kbd> + <kbd>空格</kbd> |
| 在“访达”中创建一个新文件夹 | <kbd>Shift</kbd> + <kbd>&ensp;⌘&ensp;</kbd> + <kbd>N</kbd> |
| 全屏使用应用 | <kbd>Control</kbd> + <kbd>&ensp;⌘&ensp;</kbd> + <kbd>F</kbd> |
| 立即锁定屏幕 | <kbd>Control</kbd> + <kbd>&ensp;⌘&ensp;</kbd> + <kbd>Q</kbd> |
| 睡眠 | <kbd>Option</kbd> + <kbd>&ensp;⌘&ensp;</kbd> + <kbd>电源按钮</kbd> |
| 睡眠 | <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>电源按钮</kbd> |
| 显示一个对话框，询问您是要重新启动、睡眠还是关机 | <kbd>Control</kbd> + <kbd>电源按钮</kbd> |
| 切换隐藏文件 | <kbd>&ensp;⌘&ensp;</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> |
| 切换输入法 | <kbd>Control</kbd> + <kbd>空格</kbd> |
| 字符检视器 | <kbd>Control</kbd> + <kbd>&ensp;⌘&ensp;</kbd> + <kbd>空格</kbd> |

## Mac 特殊符号

> 参考资料：[Mac 下键盘特殊符号的那些事](https://www.jianshu.com/p/12d46f7095ac)

::: tip 说明

option 的意思是选择，所以在 Mac 给 option 多一种选择，当你在 Mac 下按下 option 时，总会有多一个选项，而这就是 option 的相关性。

- <span style="color:red">option-按键 或者 shift-option-按键 来输入。</span>
- <span style="color:red">使用“字符检视器”。</span>可参考：[在 Mac 上使用表情和符号](https://support.apple.com/zh-cn/guide/mac-help/mchlp1560/11.0/mac/11.0)
  - 在 Mac 上的 App 中，选取“编辑”>“表情与符号”,快捷键<kbd>Control</kbd> + <kbd>&ensp;⌘&ensp;</kbd> + <kbd>空格</kbd>；
  - 从输入法菜单中打开“表情与符号”（如果在“键盘”偏好设置中设定了该选项）。

:::

#### 数学相关
| 符号 | 组合键 | 符号 | 组合键 |
| :-: | - | :-: | - |
| ÷ | option + / | ≠ | option + = |
| ≥ | option + > | ≤ | option + < |
| ≈ | option + x | ± | shift + option + + |
|  ⁄（分号） | shift + option + 1 | ‰（千分号） | shift + option + R |
| √（平方根） | option + V | ￢（逻辑非） | option + L |
| π（pi） | option + P | ∏（元运算） | shift + option + P |
| ∞（无穷大） | option + 5 | ø（空集） | option + O |
| ∑（求和） | option + W | ƒ（函数） | option + F |
| ∫（integral 积分） | option + B | ∂（partial differential 偏微分） | option + D |
| ∆（变量） | option + J | - | - |

#### 单位相关
| 符号 | 组合键 | 符号 | 组合键 |
| :-: | - | :-: | - |
| ˚（角度） | option + K | °（温度，如 ℃、℉） | shift + option + 8 |

#### 货币单位
| 符号 | 组合键 | 符号 | 组合键 |
| :-: | - | :-: | - |
| ¢（美分） | option + 4 | ￡（英镑） | option + 3 |
| €（欧元） | shift + option + 2 | ¥（元） | option + Y |

#### 商标相关
| 符号 | 组合键 | 符号 | 组合键 |
| :-: | - | :-: | - |
| ®（注册商标） | option + R | ©（版权） | option + G |
| ™（商标） | option + 2 | - | - |

#### 符号相关
| 符号 | 组合键 | 符号 | 组合键 |
| :-: | - | :-: | - |
| …（水平省略号） | option + : | ¡（反感叹号） | option + 1 |
| ¿（反问号） | shift + option + ? | §（分节符） | option + 6 |
| ¶（分隔符） | option + 7 | - | - |

#### 其他常用符号
| 符号 | 组合键 |
| :-: | - |
| （Apple Logo） | shift + option + K |
| ·（中点，英文名中常用的点） | shift + option + 9 |

## 输入法高效使用技巧

1. 敲击 tab 键+部首，快速找到生僻字；
2. 活用键盘符号；
   - xi'an (中文单引号)
   - Ctrl + 首字母
3. 启用 `u 模式`，快速找到生僻字；
   - 中文输入： ushiwei 、uniuniuniu
4. 启用 `v 模式`，秒变计算器;
5. 启用简拼；

> 参考资料：[【B 站最全】8 个输入法高效使用技巧，大幅提升你的打字效率，你知道几个？](https://www.bilibili.com/video/BV1754y1J7ma?spm_id_from=333.851.b_7265636f6d6d656e64.1)
