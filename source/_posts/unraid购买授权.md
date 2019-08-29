---
title: unraid购买授权
date: 2019-08-23 16:34:31
tags:
    - 体验
---



# Unraid 购买授权

深户的准迁证下来了，回老家的机票也定好了，不过想到了一个事情，unraid我现在还是使用的是试用版本，12天之后我咋办呢？所以今天把授权先购买了，

> 虽然unraid可以试用第二次，但是为了以后方便就直接购买了



## 购买流程

登录 unraid 系统， 直接点击右上角的试用期时间，进入注册页

{% asset_img registration.png UNRAID授权信息页面 %}

点击 `Purchase Key`, 跳转到官网的购买页面（官网是不能直接购买的， 必须从unraid系统里面跳转过去）

{% asset_img pricing_options.png UNRAID套餐信息 %}

下面是三个套餐的区别（也就是磁盘数量的区别）



### 下单

| Base(59$)                                      | Plus(89$)                                    | Pro(129$)      |
| ---------------------------------------------- | -------------------------------------------- | -------------- |
| 最多支持6块硬盘                                | 最多支持12块硬盘                             | 无限数量的硬盘 |
| 从Base升级到Plus需要花费 `$39` (59 + 39 = 98$) | 从Plus升级到Pro需要花费 `$49` (89+ 49= 138$) |                |
| 从Base升级到Pro需要花费 `$79` (59 + 79 = 138$) |                                              |                |

因为我的硬盘是从阵列卡出来的， 所以一共就2个磁盘，一个SSD阵列做Cache一个机械阵列做存储（都是Raid 5）, 而且我的服务器是8盘位的已经插满了，所以选了最便宜的`Base`.



### 付款

**(建议看完下面全部再操作)**

{% asset_img cart.png UNRAID购物车页面 %}

支持 `VISA` 和 `PayPal` 可谓是很友好了，我这里使用的是 paypal，

{% asset_img pricing_options.png 购物信息页面%}

这里按照自己的信息填写就好了

{% asset_img verify_order.png 购物信息页面%}

？？？ 付款失败 

{% asset_img error.png 付款失败%}

### 信用卡

重试了好几次还是失败，佛了， 换信用卡支付（我没有支持以上方式的信用卡，所以使用了 `TapGo`  见下篇）

{% asset_img cart_visa.png 付款失败%}

填上信息， 支付完成后查看邮箱，

{% asset_img key.png 邮箱内的激活Key%}

复制图上红框的url到 Unraid Registration 页面下方的 `install Key`

{% asset_img install_key.png 安装Key %}



## 激活完成

{% asset_img installed.png 安装完成 %}