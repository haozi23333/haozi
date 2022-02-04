---
slug: 2019/11/30/docker缺少TERM环境变量
title: docker缺少TERM环境变量
authors: haozi
tags: [docker, 笔记]
date: 2019-11-30 11:09:24
---

# docker缺少TERM环境变量

最近在使用docker 的时候遇到了一个问题

```sh
TERM environment variable needs set
```

经过各种搜素发现可以添加一个 ``TERM=xterm`` 或者 `ERM=linux`环境变量即可, 但是还是会出现

```sh
Your terminal lacks the ability to clear the screen or position the cursor.
```

的一个问题, 我分享一下我的解决办法, 首先在 host(宿主机)上面执行 `echo $TERM`

```
[root@localhost d]# echo $TERM
xterm-256color
```

这里得到的是 `xterm-256color`, 在 DockerFile 或者 env 参数将  `TERM=xterm-256color`带进去, 和宿主机的一致即可




<!--truncate-->

