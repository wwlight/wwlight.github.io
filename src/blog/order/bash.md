# bash 命令

:::tip 相关介绍
- [GNU Bash - 官网](https://www.gnu.org/software/bash/)
- [bash - 维基百科](https://zh.wikipedia.org/zh/Bash)
:::

## 基本操作
```sh{1,6,7,10}
$ exit                # 退出当前登陆（退出终端）
$ env                 # 显示环境变量
$ echo $SHELL         # 显示你在使用什么 SHELL

$ bash                # 使用 bash，用 exit 返回
$ which bash          # 搜索 $PATH，查找哪个程序对应命令 bash
$ whereis bash        # 搜索可执行，头文件和帮助信息的位置，使用系统内建数据库
$ whatis bash         # 查看某个命令的解释，一句话告诉你这是干什么的

$ clear               # 清除屏幕内容
$ reset               # 重置终端
```

## 目录操作
```sh{1,2,3,4,8,9,10}
$ cd                  # 返回自己 $HOME 目录
$ cd {dirname}        # 进入目录
$ pwd                 # 显示当前所在目录
$ mkdir {dirname}     # 创建目录
$ mkdir -p {dirname}  # 递归创建目录
$ pushd {dirname}     # 目录压栈并进入新目录
$ popd                # 弹出并进入栈顶的目录
$ dirs -v             # 列出当前目录栈
$ cd -                # 回到之前的目录
$ cd -{N}             # 切换到目录栈中的第 N个目录，比如 cd -2 将切换到第二个
```

## 文件操作
```sh{1,2,3,4,7,8,10,11,15,16,21,30}
$ ls                  # 显示当前目录内容，后面可接目录名：ls {dir} 显示指定目录
$ ls -l               # 列表方式显示目录内容，包括文件日期，大小，权限等信息
$ ls -1               # 列表方式显示目录内容，只显示文件名称，减号后面是数字 1
$ ls -a               # 显示所有文件和目录，包括隐藏文件（.开头的文件/目录名）
$ ln -s {fn} {link}   # 给指定文件创建一个软链接
$ cp {src} {dest}     # 拷贝文件，cp -r dir1 dir2 可以递归拷贝（目录）
$ rm {fn}             # 删除文件，rm -r 递归删除目录，rm -f 强制删除
$ rm -rf {fn}         # 删除指定文件夹所有内容
$ mv {src} {dest}     # 移动文件，如果 dest 是目录，则移动，是文件名则覆盖
$ touch {fn}          # 创建或者更新一下制定文件
$ cat {fn}            # 输出文件原始内容
$ any_cmd > {fn}      # 执行任意命令并将标准输出重定向到指定文件
$ more {fn}           # 逐屏显示某文件内容，空格翻页，q 退出
$ less {fn}           # 更高级点的 more，更多操作，q 退出
$ head {fn}           # 显示文件头部数行，可用 head -3 abc.txt 显示头三行
$ tail {fn}           # 显示文件尾部数行，可用 tail -3 abc.txt 显示尾部三行
$ tail -f {fn}        # 持续显示文件尾部数据，可用于监控日志
$ nano {fn}           # 使用 nano 编辑器编辑文件
$ vim {fn}            # 使用 vim 编辑文件
$ diff {f1} {f2}      # 比较两个文件的内容
$ wc {fn}             # 统计文件有多少行，多少个单词
$ chmod 644 {fn}      # 修改文件权限为 644，可以接 -R 对目录循环改权限
$ chgrp group {fn}    # 修改文件所属的用户组
$ chown user1 {fn}    # 修改文件所有人为 user1, chown user1:group1 fn 可以修改组
$ file {fn}           # 检测文件的类型和编码
$ basename {fn}       # 查看文件的名字（不包括路径）
$ dirname {fn}        # 查看文件的路径（不包括名字）
$ grep {pat} {fn}     # 在文件中查找出现过 pat 的内容
$ grep -r {pat} .     # 在当前目录下递归查找所有出现过 pat 的文件内容
$ stat {fn}           # 显示文件的详细信息
```

## 系统信息
```sh{5,6,7,13,14}
$ uname -a                  # 查看内核版本等信息
$ man {help}                # 查看帮助
$ man -k {keyword}          # 查看哪些帮助文档里包含了该关键字
$ info {help}               # 查看 info pages，比 man 更强的帮助系统
$ uptime                    # 查看系统启动时间
$ date                      # 显示日期
$ cal                       # 显示日历
$ vmstat                    # 显示内存和 CPU 使用情况
$ vmstat 10                 # 每 10 秒打印一行内存和 CPU情况，CTRL+C 退出
$ free                      # 显示内存和交换区使用情况
$ df                        # 显示磁盘使用情况
$ du                        # 显示当前目录占用，du . --max-depth=2 可以指定深度
$ uname                     # 显示系统版本号
$ hostname                  # 显示主机名称
$ showkey -a                # 查看终端发送的按键编码
```

## 用户管理
```sh{1,2,3,4,5,6}
$ sudo {command}      # 以 root 权限执行某命令
$ whoami              # 显示我的用户名
$ who                 # 显示已登陆用户信息，w / who / users 内容略有不同
$ w                   # 显示已登陆用户信息，w / who / users 内容略有不同
$ users               # 显示已登陆用户信息，w / who / users 内容略有不同
$ passwd              # 修改密码，passwd {user} 可以用于 root 修改别人密码
$ finger {user}       # 显示某用户信息，包括 id, 名字, 登陆状态等
$ adduser {user}      # 添加用户
$ deluser {user}      # 删除用户
$ su                  # 切换到 root 用户
$ su -                # 切换到 root 用户并登陆（执行登陆脚本）
$ su {user}           # 切换到某用户
$ su -{user}          # 切换到某用户并登陆（执行登陆脚本）
$ id {user}           # 查看用户的 uid，gid 以及所属其他用户组
$ id -u {user}        # 打印用户 uid
$ id -g {user}        # 打印用户 gid
$ write {user}        # 向某用户发送一句消息
$ last                # 显示最近用户登陆列表
$ last {user}         # 显示登陆记录
$ lastb               # 显示失败登陆记录
$ lastlog             # 显示所有用户的最近登陆记录
```

## 进程管理
```sh{1,16,24}
$ ps                        # 查看当前会话进程
$ ps ax                     # 查看所有进程，类似 ps -e
$ ps aux                    # 查看所有进程详细信息，类似 ps -ef
$ ps auxww                  # 查看所有进程，并且显示进程的完整启动命令
$ ps -u {user}              # 查看某用户进程
$ ps axjf                   # 列出进程树
$ ps xjf -u {user}          # 列出某用户的进程树
$ ps -eo pid,user,command   # 按用户指定的格式查看进程
$ ps aux | grep httpd       # 查看名为 httpd 的所有进程
$ ps --ppid {pid}           # 查看父进程为 pid 的所有进程
$ pstree                    # 树形列出所有进程，pstree 默认一般不带，需安装
$ pstree {user}             # 进程树列出某用户的进程
$ pstree -u                 # 树形列出所有进程以及所属用户
$ pgrep {procname}          # 搜索名字匹配的进程的 pid，比如 pgrep apache2

$ kill {pid}                # 结束进程
$ kill -9 {pid}             # 强制结束进程，9/SIGKILL 是强制不可捕获结束信号
$ kill -KILL {pid}          # 强制执行进程，kill -9 的另外一种写法
$ kill -l                   # 查看所有信号
$ kill -l TERM              # 查看 TERM 信号的编号
$ killall {procname}        # 按名称结束所有进程
$ pkill {procname}          # 按名称结束进程，除名称外还可以有其他参数

$ top                       # 查看最活跃的进程
$ top -u {user}             # 查看某用户最活跃的进程

$ any_command &             # 在后台运行某命令，也可用 CTRL+Z 将当前进程挂到后台
$ jobs                      # 查看所有后台进程（jobs）
$ bg                        # 查看后台进程，并切换过去
$ fg                        # 切换后台进程到前台
$ fg {job}                  # 切换特定后台进程到前台

$ trap cmd sig1 sig2        # 在脚本中设置信号处理命令
$ trap "" sig1 sig2         # 在脚本中屏蔽某信号
$ trap - sig1 sig2          # 恢复默认信号处理行为

$ nohup {command}           # 长期运行某程序，在你退出登陆都保持它运行
$ nohup {command} &         # 在后台长期运行某程序
$ disown {PID|JID}          # 将进程从后台任务列表（jobs）移除

$ wait                      # 等待所有后台进程任务结束
```

## 网络操作
```sh{1}
$ ping {host}               # ping 远程主机并显示结果，CTRL+C 退出
$ ping -c N {host}          # ping 远程主机 N 次
$ traceroute {host}         # 侦测路由连通情况
$ mtr {host}                # 高级版本 traceroute
$ host {domain}             # DNS 查询，{domain} 前面可加 -a 查看详细信息
$ whois {domain}            # 取得域名 whois 信息
$ dig {domain}              # 取得域名 dns 信息
$ route -n                  # 查看路由表
$ netstat -a                # 列出所有端口
$ netstat -an               # 查看所有连接信息，不解析域名
$ netstat -anp              # 查看所有连接信息，包含进程信息（需要 sudo）
$ netstat -l                # 查看所有监听的端口
$ netstat -t                # 查看所有 TCP 链接
$ netstat -lntu             # 显示所有正在监听的 TCP 和 UDP 信息
$ netstat -lntup            # 显示所有正在监听的 socket 及进程信息
$ netstat -i                # 显示网卡信息
$ netstat -rn               # 显示当前系统路由表，同 route -n
$ ss -an                    # 比 netstat -an 更快速更详细
$ ss -s                     # 统计 TCP 的 established, wait 等

$ wget {url}                # 下载，可加 --no-check-certificate，忽略ssl验证
$ wget -qO- {url}           # 下载文件并输出到标准输出（不保存）
$ curl -sL {url}            # 同 wget -qO- {url} 没有 wget 的时候使用

$ sz {file}                 # 发送文件到终端，zmodem 协议
$ rz                        # 接收终端发送过来的文件
```

## 网络管理
```sh{14,15}
$ ip a                               # 显示所有网络地址，同 ip address
$ ip a show eth1                     # 显示网卡 IP 地址
$ ip a add 172.16.1.23/24 dev eth1   # 添加网卡 IP 地址
$ ip a del 172.16.1.23/24 dev eth1   # 删除网卡 IP 地址
$ ip link show dev eth0              # 显示网卡设备属性
$ ip link set eth1 up                # 激活网卡
$ ip link set eth1 down              # 关闭网卡
$ ip link set eth1 address {mac}     # 修改 MAC 地址
$ ip neighbour                       # 查看 ARP 缓存
$ ip route                           # 查看路由表
$ ip route add 10.1.0.0/24 via 10.0.0.253 dev eth0    # 添加静态路由
$ ip route del 10.1.0.0/24           # 删除静态路由

$ ifconfig                           # 显示所有网卡和接口信息
$ ifconfig -a                        # 显示所有网卡（包括开机没启动的）信息
$ ifconfig eth0                      # 指定设备显示信息
$ ifconfig eth0 up                   # 激活网卡
$ ifconfig eth0 down                 # 关闭网卡
$ ifconfig eth0 192.168.120.56       # 给网卡配置 IP 地址
$ ifconfig eth0 10.0.0.8 netmask 255.255.255.0 up     # 配置 IP 并启动
$ ifconfig eth0 hw ether 00:aa:bb:cc:dd:ee            # 修改 MAC 地址

$ nmap 10.0.0.12                     # 扫描主机 1-1000 端口
$ nmap -p 1024-65535 10.0.0.12       # 扫描给定端口
$ nmap 10.0.0.0/24                   # 给定网段扫描局域网内所有主机
$ nmap -O -sV 10.0.0.12              # 探测主机服务和操作系统版本
```

## 命令处理
```sh{3}
$ command ls                         # 忽略 alias 直接执行程序或者内建命令 ls
$ builtin cd                         # 忽略 alias 直接运行内建的 cd 命令
$ enable                             # 列出所有 bash 内置命令，或禁止某命令
$ help {builtin_command}             # 查看内置命令的帮助（仅限 bash 内置命令）
$ eval $script                       # 对 script 变量中的字符串求值（执行）
```

## 其他命令
```sh{3,4}
$ man hier                           # 查看文件系统的结构和含义
$ man test                           # 查看 posix sh 的条件判断帮助
$ man ascii                          # 显示 ascii 表
$ getconf LONG_BIT                   # 查看系统是 32 位还是 64 位
$ bind -P                            # 列出所有 bash 的快捷键
$ mount | column -t                  # 漂亮的列出当前加载的文件系统
$ curl ip.cn                         # 取得外网 ip 地址和服务商信息
$ disown -a && exit                  # 关闭所有后台任务并退出
$ cat /etc/issue                     # 查看 Linux 发行版信息
$ lsof -i port:80                    # 哪个程序在使用 80 端口
$ showkey -a                         # 取得按键的 ASCII 码
$ svn diff | view -                  # 使用 Vim 来显示带色彩的 diff 输出
$ mv filename.{old,new}              # 快速文件改名
$ time read                          # 使用 CTRL-D 停止，最简单的计时功能
$ cp file.txt{,.bak}                 # 快速备份文件
$ sudo touch /forcefsck              # 强制在下次重启时扫描磁盘
$ find ~ -mmin 60 -type f            # 查找 $HOME 目录中，60 分钟内修改过的文件
$ curl wttr.in/~beijing              # 查看北京的天气预报
$ echo ${SSH_CLIENT%% *}             # 取得你是从什么 IP 链接到当前主机上的
$ echo $[RANDOM%X+1]                 # 取得 1 到 X 之间的随机数
$ bind -x '"\C-l":ls -l'             # 设置 CTRL+l 为执行 ls -l 命令
$ find / -type f -size +5M           # 查找大于 5M 的文件
$ chmod --reference f1 f2            # 将 f2 的权限设置成 f1 一模一样的
$ curl -L cheat.sh                   # 速查表大全
```

> 内容来自：[BASH 中文速查表](https://doc.zdzn.net/cheatsheet/bash.html)