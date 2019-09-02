---
title: unraid初体验
date: 2019-08-22 14:39:09
tags: 新玩意 瞎搞
---



# UNRAID 初体验

## 缘由

最近我给我的大奶和服务器上了两张X520来体验一下, 不过遇到了一个问题, ESXI里面我没法把两个不同的网卡拉在一个交换机里面(外置交换机2K软妹币起步太贵不考虑) 太sb了  

后面打算把系统换掉改成 LINUX装KVM算了.  调研了很多 KVM带Web界面的管理器, 最后找到了 [UNRAID]([https://unraid.net](https://unraid.net/)) 这个系统(突然想起在 LinusTechTips 的视频里面见过类似的)

unraid是基于linux的, 这就对我们`搞机` 提供了巨大的方便, 交换机路由随便设置, KVM这个虚拟化也提供了更多操作空间, 顺便重新装系统把不需要的数据清一清  

**不过要注意一点是UNRAID是付费的**



## 安装

这个就很简单了, 官网直接下载安装器, 插上U盘, 傻瓜式操作.....

> 这里有一个提示点, 至今(2019年8月22日)官方未提供硬盘安装的方式, 这里就不要去瞎折腾了(~~我折腾过了~~), 因为你辛辛苦苦吧系统塞到硬盘里面去, 还是会提醒你插一个U盘的(授权识别码是基于U盘的GUID的)

U盘部署好, 开机就行了



## 初始化

把你的硬盘按照相应的说明填写进去  

我的硬盘是到直接连到阵列卡的, 3个450G Intel SSD 5个 6T的希捷 6T企业盘. 只导出了2个虚拟磁盘, 一个作为Disk,  一个作为 Cache,  阵列卡就不需要做校验磁盘了(前提你使用的是非 RAID 0)

{% asset_img unraid_array.png UNRAID 磁盘编辑页 %}



## 实际使用

试用期30天 我已经使用了17天,  我还是非常满意的, 这张图可以看到我在上面开了4个虚拟机, 1个Dodcker 容器, 6 个 Shares

{% asset_img unraid_home.png UNRAID 主页图片 %}

其中每一个Share可以分配这4种不同的方式来进行访问, NFS对linux, AFP对 apple等

{% asset_img unraid_share_network.png UNRAID share网络服务 %}



## 优化体验

可以在unraid里面安装应用市场, 在 Plugin选项卡里面, 选择 Install Plugin 填入下面的

`https://raw.githubusercontent.com/Squidly271/community.applications/master/plugins/community.applications.plg`

可以在里面找到各种好♂玩的, 比如上面图中的`aria2webui`



## 购买

参见 [Unraid 购买授权](/2019/08/24/unraid购买授权/)

## ~

有啥想知道的可以留言

