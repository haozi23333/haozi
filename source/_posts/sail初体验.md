---
title: sail初体验
date: 2019-11-28 01:28:00
tags:
    - vscode
    - 效率
---



# sail初体验

有确说实, 虽然我大部分开发的时候使用的是 jetbrains 系的开发工具, 但是云上开发就是时代的潮流, 谁不想随时随地的开发, 谁不想只开一个浏览器就拥有所有的环境, 在这个时代下 vscode 和 docker 这个组合应运而生,  code-server 这个可以服务端可以提供远程的 vscode 支持,  这个就让梦想近了一步, 

{% githubCard user:cdr repo:code-server %}

<!--more-->



## coder.com

这玩意域名以前是 coder-server 的推广页, 现在变成了 coder 平台的推广页, 这是一个企业级的开发环境,  将源码, 开发环境放置在一起, 云端开发, 云端协作的管理工具, 

看起来十分的美好, **但是** !!!

这玩意目前还暂未提供使用, (**虽然有安装文档, 但是没有提供 下载包**)

<video src="./engineered.mp4" controls></video>

<center>官方视频(740KB)</center>

## sail

这也是 coder 旗下的开源项目, 这项目有点意思,  用来管理 Dockerized 的开发环境, 用 docker 工具链 和 code-server 来创建基于 web 的开发环境

{% githubCard user:cdr repo:sail %}

文档 -> [Sail Docs](https://sail.dev/docs/introduction/)

### 安装

截止文章编写, 目前只支持 `Macos / linux`, 需要提前安装好

* Docker
* Git
* Chrome(可选), 其他浏览器也行

执行下方安装脚本, 或者到 [github releases](https://github.com/cdr/sail/releases) 里面下载二进制放到环境变量, 源码安装见官方文档

`curl https://sail.dev/install.sh | bash`

### 浏览器插件

配合这个 sail 使用需要一个浏览器插件(可选), 会对 github 等页面添加一个 `open in sail`的按钮, 方便快速的进入开发

* 安装:  [Chrome 应用商城](https://chrome.google.com/webstore/detail/sail/deeepphleikpinikcbjplcgojfhkcmna)
* 运行 `sail install-for-chrome-ext` 启动特性

### 初体验

第一次使用的话, 先试试把 https://github.com/cdr/sail/ 官方项目 使用 sail 启动一下, 启动成功的话会显示一个地址, 就可以访问了

```pascal
2019-11-28 11:47:28 INFO	please visit http://127.0.0.1:51332
sail socket was closed: 1000
```

如果那个小黑框消失了, 使用 `sail ls` 命令来查看

```sh
Projects/haozi23333/haozi at ☸️  kubernetes-admin@kubernetes
➜ sail ls
name               hat   url                      status
haozi23333/haozi         http://127.0.0.1:50862   Up 5 hours
cdr/sail                 http://127.0.0.1:51332   Up 6 hours

```



#### 密码

这个文档没写, 密码需要你使用 `docker ps`进去, 查询到 容器 id, 然后使用 `docker logs <容器 ID>`,  里面就会有一段类似 `Password is 59633724a8e09de9a4469c1e`

```sh
Projects/haozi23333/haozi at ☸️  kubernetes-admin@kubernetes
➜ docker logs 4c13ce7bff89
+ cd /home/user/go/src/go.coder.com/sail
+ sudo chown user:user /home/user/.vscode
+ code-server --host 0.0.0.0 --port 8443 --data-dir /home/user/.config/Code --extensions-dir /home/user/.vscode/host-extensions --extra-extensions-dir /home/user/.vscode/extensions --allow-http --no-auth
+ tee /tmp/code-server.log
Option 'data-dir' is unknown. Ignoring.
Option 'allow-http' is unknown. Ignoring.
Option 'data-dir' is unknown. Ignoring.
Option 'allow-http' is unknown. Ignoring.
info  Server listening on http://0.0.0.0:8443
info    - Password is 59633724a8e09de9a4469c1e
info      - To use your own password, set the PASSWORD environment variable
info      - To disable use `--auth none`
info    - Not serving HTTPS

```

进入之后, 如果没显示项目就手动 open 一下, 位置在 `/home/user/xxxxxx`

> macOS 的 Docker 目前无法使用 HOST 网络, 所以需要 自定义镜像, EXPORT 一下

> 会加载本地的 vscode 插件

### 自定义环境

可以看到上面 sail 的代码里面有一个 `.sail` 的文件夹, 里面有一个 Dockerfile 文件, 这个就是用来自定义开发环境的的, 官方提供了一些基础环境的镜像, 但是都有一个特点, 很久没更新了

* code-server
* Ubuntu-docker
* Ubuntu-dev-gcc8
* Ubuntu-dev-python2.7
* Ubuntu-dev-openjdk8
* Ubuntu-dev-go
* Ubuntu-dev-llvm8
* Ubuntu-dev-openjdk12
* Ubuntu-dev-node12
* Ubuntu-dev-ruby2.6
* Ubuntu-dev-python3.7

可以再 [docker hub](https://hub.docker.com/u/codercom) 找到, 下面是一个从 `ubuntu-docker` 开始构建的过程(大部分的都是 4 个月+ 没重新构建了, 怕代码太旧, 手动更新一下)

```dockerfile
# 从比较基本的 Ubuntu-docker 开始, 目前比较新, 否则需要自己拉 sail 的代码从头构建
FROM codercom/ubuntu-docker


# 这部分是 Ubuntu-dev 的构建代码, 由于太久么更新了, 就复制过来了
LABEL share.ssh="~/.ssh:~/.ssh"

RUN adduser --gecos '' --disabled-password user && \
    echo "user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/nopasswd
    
# 这里切换到 root , code-server 这个可能会没有权限读写 /home/user, 
USER root

RUN mkdir -p ~/.vscode/extensions

# 安装 Node 13 的依赖
CMD ["/bin/bash", "-c"]
RUN sudo apt-get update && \
  sudo apt-get install -y htop
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash && \
  . ~/.nvm/nvm.sh \
  && nvm install node

# 全局安装 hexo
RUN npm i -g hexo
```



{% githubCard user:haozi23333 repo:haozi %}

然后在代码页面点击, open in sail 开始构建

> 要注意一件事情, 默认的存储地址为 `~/Project`, 需要改的话修改` LABEL project_root`

> 代码是被挂在到容器里面的, 即使 sail 里面删除了 这个项目, 但是本地文件是不会删除的, 这就导致了一个问题, 如果做了变动, 并不会 clone 最新的, 而是使用本地的版本,  出现问题的时候, 就去删一下本地文件

> 到目前的编写文章时间,  无法使用 rebuild 来重新构建环境, [参考文档, 环境编辑](https://sail.dev/docs/concepts/environment-editing/)也就是不能自动构建其他分支的(tui!),  虽然有一个 issues 提到了在 vs 的 cmd 里面加入了 rebuild, 然而也没有, **所以现在的就是需要重新构建一个新的 sail 项目, 需手动删一下**

{% asset_img haozi.png 截图 %}

勉强可以用了~

## 后

目前在持续追踪这玩意的开发, 希望这种可以快一点的修复 bug, 完善起来, 以后在 github 看代码的时候, 一些项目就可以直接点击 open in sail, 直接打开一个编辑器, 用来阅读代码或者直接开发, 提升工作效率~~sourcegraph 体验不佳~~

> 懒(效率), 是第一生产力, hhhh

如果以后这个项目有了新的进展, 或者有新的使用姿势, 我也会更新新的文章~