---
title: 使用socks代理连接websocket
date: 2019-12-25 20:50:03
tags:
	- 笔记
---



# 使用socks代理连接websocket

最近需要收集一些使用 websocket 传输的数据,  为了防止同 IP 并发量过大,  被封号, 需要使用 代理来访问消息服务器

![哈欠](/sticker/tang.png)

<!--more-->

## 准备

这里用到了
<center>
<a target="_blank" href="https://github.com/websockets/ws" _tr>
websockets- ws</a>
这个库支持设置网络代理
</center>

{% githubCard user:websockets repo:ws %}



<center>
<a target="_blank" href="https://github.com/TooTallNate/node-socks-proxy-agent" _tr>node-socks-proxy-agent</a>
socks 
一个 基于Socks(v4/v5) 实现的 `http.Agent` 
</center>

{% githubCard user:TooTallNate repo:node-socks-proxy-agent %}

## 代理连接 Websocket

初始化 Agent

```typescript
import * as SocksProxyAgent from 'socks-proxy-agent'

const proxyAgent = new SocksProxyAgent(`socks://127.0.0.1:1080`);
```

连接 WebSocket 服务器

```typescript
import * as ws from 'ws'
       
const io = new ws(`wss://x.x.x.x`, {
  agent: proxyAgentproxyAgent
})
```



## 代理请求  Axios

```typescript
import axios from 'axios'

await axios.get(`url`, {
     httpsAgent: proxyAgent,
    // 或
     httpAgent: proxyAgent
})
```


>  但是参考 [axios - Issuse 636](https://github.com/axios/axios/issues/636) 说到需要同时 `httpsAgent`, 和 `httpAgent`
>  