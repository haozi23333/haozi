---
title: 使用 Google的analyticsjs分析用户行为
date: 2019-12-23 16:04:44
tags:
  - 笔记  
  - 数据分析
---



# 使用 Google的analyticsjs分析用户行为

文档 https://developers.google.com/analytics/devguides/collection/analyticsjs

从本篇文章开始, 本站开启了 analyticsjs 的自定义追踪器功能

并通过以下的

* 部分 UI 的点击事件

* 部分 

* Gitalk 登录状态(不包括用户信息)

  

> 本站不会与其他数据分析系统共享数据



## 设置 Analytics

### 打开特性

如果您的浏览器支持  [`navigator.sendBeacon`](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon) 的方法, 可以将 `'beacon'` 指定为 `transport` 机制

```javascript
ga('set', 'transport', 'beacon');
```

### 添加 代理函数

建议设置一个 ga 函数的代理, 方便本地调试时不触发, 或者禁用跟踪, 或者其他的处理方式

> 当然你也可以使用 debug 版本的  参见 [analytics.js 调试 ](https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging)

```javascript
function ga_proxy() {
  if (document.location.href.indexOf('127.0.0.1') > -1 || document.location.href.indexOf('localhost') > -1) {
    console.log(`ga(`)
    console.log(arguments)
    console.log(`)`)
  } else {
    ga.apply(ga, arguments)
  }
}
```



### 创建 Tracker

这个是跟踪器

本站主要是以两点

* UI 部分	(webui)

  * `ga('create', '<跟踪ID>', 'auto', 'webui');`

* 内容部分 (content)

  * `ga('create', '跟踪ID', 'auto', 'content');`

## 监听事件

以下是根据本站进行定义的一些行为分析

### Live2D 相关

查看用户对我页面的live2d感兴趣程度, 最近有点想换成 three.js 加载 泠鸢yousa 水着的模型 ⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄

#### 点击事件

```javascript
(() => {
    // 由于是异步生成的, 且没有事件, 所以定时器检测
  const timer = setInterval(() => {
    if (document.getElementById('live2d-widget')) {
      document.getElementById('live2d-widget').style['pointer-events'] = 'all'
      document.getElementById('live2d-widget').addEventListener('click', () => {
        ga_proxy('webui.send', 'event', 'click', 'Live2D', 1)
      })
      clearInterval(timer);
    }
  }, 1000);
})();
```

### 文章相关

由于大部分的链接都属于当前页面加载, 所以点击的时候, 并不能发送 事件信息,  而且我也不想用 hook 的方式做, 万一请求超时了 就很难受

这里我选择了从 `document.referrer` 读取相关信息

> 不过还有一个方案, 可以先让信息存在 localstorage, 然后跳转到新页面之后, 读取信息再提交

> 要记得 `decodeURI(document.referrer)`  把编码后的字符串解码回来



#### TAG 点击事件

```javascript
// 如果是 TAG 页面
if (document.location.pathname === '/tags/') {
  ga_proxy('webui.send', 'event', 'click', 'tag', referrer, decodeURI(document.location.hash).replace('#', '') )
}
```

#### 上/下 篇文章按钮 

这个不是很好统计,  就直接统计为 跳转页面链接 即可

```javascript
ga_proxy('content.send', 'event', 'PrevPost', referrer, document.location.href)
```



#### 归档页面点击

如果发现

```javascript
if (referrerParams[5] === 'archives/') {
    ga_proxy('webui.send', 'event', 'click', 'Archives', decodeURI(document.location.pathname))
  }
```





### 内容相关

主要是对内容的感兴趣程度的跟踪



## 参考资料



[1]: analytics.js 中文文档 https://developers.google.com/analytics/devguides/collection/analyticsjs