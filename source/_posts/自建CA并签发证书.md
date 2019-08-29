---
title: 自建CA并签发证书
date: 2019-08-28 21:36:19
tags:
    - 瞎搞
    - 笔记
---

# 自建CA并签发证书

为了家里内网服务部署的方便使用了统一的域名 `haozi.local` , 这是一个本地域名, 没法通过常规的方式申请有效的https证书, 所以需要在内网搭建一个专门的CA,用于签发这个域名的证书等



<!--more-->



## 自建CA颁发机构

查看 `/etc/pki/tls/openssl.cnf` 配置文件,  一般用的话不需要修改, 这里为了内网使用方便修改了 `default_days` (证书的有效时间, 默认365天)参数.

### 生成CA证书

使用 RSA 算法生成 2048 位 CA 私钥

```sh
openssl genrsa -out ~/ca/ca.key.pem 2048
```

生成CA证书请求文件, 按照提示填写正确的信息

```sh
openssl req -new -key ~/ca/ca.key.pem -out ~/ca/ca.cert.pem
```

`ca.cert.pem` 这个文件就可以发给各个客户端进行安装, 用于信任之后签发的所有证书





```sh
openssl ca -selfsign -in ~/ca/ca.cert.pem -out /opt/ca/root/key/cacert.crt -config /opt/ca/root/openssl.cnf
```

