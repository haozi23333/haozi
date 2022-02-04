---
slug: 2020/10/17/快手sig3思路
title: 某手__NS_sig3 思路
authors: haozi
tags: [笔记, 破解]
date: 2020-10-17 16:19:38
---


# 某手__NS_sig3 思路

这个当时想了各种办法, 由于封装在 so 里面想了好久也没法解决.  后面在 csdn 看到一篇关于 hook 分析的, 让我打开了新世界的大门. 

**直接 HOOK 签名函数**

> 截止到目前, 快手接口已经不需要 __NS_sig3 参数

> 建议先去看看 [参考资料<sup>1</sup>](#参考资料) 的原文, 本文不会过多的介绍寻找调用的位置

> 各位老板有这方面的需求(包括, 并不限于这些)可以滴滴我~



![%}](./快手sig3思路/file_6228125.png)

<!--truncate-->

## Xposed

自从手机换了 iPhone 再也没接触过安卓了,  不过 xposed 还是记得的.  以前刷好 CM 还得装各种插件, 各种模块 6 的起飞. 之前都是使用大佬写好的插件, 这次需要自己编写插件去 hook 函数


## 反 Xposed

> 比如你发现反编译时候函数是存在的, hook 时候遍历出来的函数表不一致的时候, 就需要考虑这个了


很多 App 都做了一些用来检测是否安装 Xposed , 是否 root 的机制, 所以我们要针对这些做一些处理 (如果做处理的话, 你并不能找到调用点)

* 目前推荐模拟器:  逍遥安卓 (方便多开, 备份, 可以成功隐藏)
* 检测是否隐藏插件 Xposed Checker
* 用来隐藏 Xposed Hider

最终就是要在 Xposed Hider 里面看到 0/11, 只要可信度不是 0, 都能被发现, 影响 hook



## 寻找到调用点

> **注意**: 不同版本的客户端, 类以及函数名称可能不相同, 这里忽略寻找过程, 直接给出 Hook 点 `com.kuaishou.android.security.a.a.a` 以及函数名 `a`

```java
public class a implements d {

    private com.kuaishou.android.security.kfree.b.d f6248a = null;

    public a(com.kuaishou.android.security.kfree.b.d dVar) {
        a(dVar, new Object[0]);
    }

    @Override //
    public int a(com.kuaishou.android.security.kfree.b.d dVar, Object[] objArr) {
        this.f6248a = dVar;
        return 0;
    }

    @Override //
    public boolean a(i iVar, String str) {
        if (iVar != null) {
            try {
                if (!(iVar.i() == null || iVar.i().length == 0)) {
                    String trim = new String(iVar.i()).trim();
                    String str2 = (String) this.f6248a.getRouter().a(
                      10405,
                      new String[]{trim},
                      KSecurity.getAPPKEY(),
                      -1,
                      Boolean.FALSE,
                      KSecurity.getkContext(),
                      0,
                      Boolean.valueOf(iVar.b())
                    );
                    if (str2 == null || str2.length() == 0) {
                        return false;
                    }
                    iVar.c(str2.getBytes(com.kuaishou.android.security.ku.d.f6301a));
                    return true;
                }
            } catch (KSException e) {
                com.google.a.a.a.a.a.a.a(e);
                throw new KSException(ClientEvent.TaskEvent.Action.WHOLE_UPLOAD);
            } catch (UnsupportedEncodingException e2) {
                com.google.a.a.a.a.a.a.a(e2);
                throw new KSException(ClientEvent.TaskEvent.Action.WHOLE_UPLOAD);
            }
        }
        return false;
    }
}
```

构造函数 `a`  的第一个参数比较复杂, 这里可以选择 hook 这个函数, 将第一次的值存储下来, 之后继续使用, 第二个参数为固定值 "0335"

函数 `a` 的参数为 `com.kuaishou.android.security.kfree.c.i`, 和一个 String, 经过 Hook 断点参数为 请求地址的PATH 和 sig 参数拼接完成

剩下要做的就是去构造整 i, 来调用这个一个函数

## 寻找参数

随便找了一个调用点 (去除多余部分)

```java
    public String a(String str) {
        i iVar = new i();
        iVar.a(KSecurity.getAPPKEY());
        iVar.a((Map<String, String>) null);
        iVar.b(3);
        iVar.b(str.getBytes());
        if (i.a(this.f6262a) == null || i.a(this.f6262a).d() == null) {
        }
        try {
            i.a(this.f6262a).d().a(iVar, "0335");
            if (iVar.j() == null || iVar.j().length == 0) {
                return "";
            }
            com.kuaishou.android.security.ku.klog.e.a("checkenv return:%s", a.a(iVar.j()));
            return new String(iVar.j());
        }
    }
```

这里可以看到 "0335" 参数的来源, 以及 i 的调用过程

* 先调用 a 函数写入 appkey
* 在调用 a 函数的重载传入一个 null
* 再调用 b 函数, 3
* 再调用 b 函数的重载 传入需要被签名的参数 的 bytes
* 使用 
* 调用 `com.kuaishou.android.security.a.a` 的`a` 函数, 传入 i 和 "0335"
* 调用 i.j() 获取签名好的值

## 构造调用

只要搞清楚的调用顺序, 以及 hook 点, 剩下的就很简单了, 新建个 Xposed 工程开始撸

可以构造的值就自己构造, 比较复杂的值,  或者某些特殊的实例, 可以选择 hook 相关部分, 进行保存

## 对外提供接口

可以选用 MQ 或者 REST 接口对外提供签名服务,  我这里选的 MQ

## 后~

刚写完不就就几天, __NS_sig3 签名就不需要了, 比较郁闷

## 参考资料

[1]: 某手sig与__NS_sig3 hook分析(二) https://blog.csdn.net/qq_34581212/article/details/107003182





