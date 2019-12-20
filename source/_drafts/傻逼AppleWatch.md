---
title: 傻逼AppleWatch
date: 2019-12-13 12:48:41
tags:
	- 日记
---



# 傻逼AppleWatch

最近遇到了一个比较傻逼的事情

我在TG看到有一个频道推送了关于 IOS `13.3` 更新了联通 VoLTE 的设置，便更新了最近的 IOS 系统，也顺便把我的 WatchOS 更新到了 `6.1.1` 的版本

IOS 13.3 更新了安全策略, 禁止简单密码, 必须使用 6位或以上的密码, 这个倒还能理解,  我有面部识别 . 但是这个 Watch 还得来个强制 6位密码,  我就不是很懂了, 用表不就是为了图个方便么,  还要再这么小的表上面戳 7 下等几秒, 有点睿智(简单密码无法点击)



## 症状

{% asset_img watch.png watch%}

<center style="margin-bottom:.5rem">your iphone has a policy that requires a new Apple Watch passcode</center>
不管你怎么删除 Watch 的密码,  锁定之后都会出现这个界面要求你给 Watch 设置一个新密码,



## 联系客服

上班中午休息的空间, 我咨询了一下 Apple 的技术支持, 首先给我介绍了会出现这个界面的场景

* 设备安装了描述文件或设备管理，对设备的安全性进行了限制
* 有 Exchange 邮箱对设备的安全性进行了限制
* 还有一种情况是设备的 Apple Pay 内有银联银行卡或中国大陆的交通卡

其中我没安装 描述文件, 第二也不是 Exchange 邮箱,  Wallet 没有 Card,  最后来了一句

> 在 iOS 13 或 watchOS 6 下有安全策略让用户设备设置强密码。若 iPhone 配对了 Apple Watch，即便 Apple Watch 上没有卡片，Apple Watch 也会被要求设置强密码。

令人裂开

## 后

没啥好说的