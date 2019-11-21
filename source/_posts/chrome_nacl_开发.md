---
title: Chrome NaCl 开发
date: 2019-11-21 21:36:16
tags:
	- chrome
---



# Chrome NaCl 开发

又是没有工作的一天,  想起了 Chrome APP(Secure Shell App)这个东西 启动的时候会显示一句 `正在加载 NaCl 插件`, 当时对这个 `NACL` 感兴趣了, 现在有时间可以来补充一下知识了

NACL 这玩意已经出了 N年了,但是社区使用率不是很高,  2019年 12 月以后 chrome 将要开始弃用这个模块, 需要转到 `Emscripten`(但是这玩意阉割了好多东西, TCP,UDP 都不是完整的了),  大力发展  `WebAssembly`

虽然快没了,但是象征性的学习一下开发, 难度也不是很高

> 49年入国军 ????

下面的项目的代码地址, 有需要的可以参考一下

{% githubCard user:haozi23333 repo:coolq_web_nacl_example %}

<!--more-->

## 安装

## 打开 NACL 支持

先检查 nacl 是否开启, 进入 `chrome://nacl/`

```
About NaCl
Google Chrome 78.0.3904.70 (beta)
OS Mac OS X
NaCl plugin internal-nacl-plugin
Portable Native Client (PNaCl) Enabled
PNaCl translator path /Users/haozi/Library/Application Support/Google/Chrome/pnacl/0.57.44.2492/_platform_specific/x86_64
PNaCl translator version 5dfe030a71ca66e72c5719ef5034c2ed24706c43
Native Client (non-portable, outside web store) Disabled // 为关闭
```

首先打开 `nacl` flag, 参见 [打开 nacl](https://chromium.googlesource.com/native_client/src/native_client/+/refs/heads/master/docs/native_client_in_google_chrome.md) , 

```sh
# MACOS 用户可以直接使用下面的
sudo /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-nacl
```

启动成功之后在此进入 `chrome://nacl/`

```
About NaCl
Google Chrome 79.0.3945.29 (beta)
OS Mac OS X
NaCl plugin internal-nacl-plugin
Portable Native Client (PNaCl) Enabled
PNaCl translator Not installed
Native Client (non-portable, outside web store) Enabled by flag '--enable-nacl' // 已开启
```



### 安装 SDK

先按照下方的 `Prerequisites` 准备好 `Python 2.7` 已经 `make`等依赖, [下载 SDK](https://developer.chrome.com/native-client/sdk/download) , 解压 并进入目录, 执行`./naclsdk list`

```sh
~/Downloads/nacl_sdk at ☸️  kubernetes-admin@kubernetes
➜ ./naclsdk list
Bundles:
 I: installed
 *: update available

  I  sdk_tools (stable)
     vs_addin (dev)
     pepper_47 (post_stable)
     pepper_49 (stable)
     pepper_50 (beta)
  I  pepper_55 (beta)
     pepper_56 (dev)
     pepper_canary (canary)

All installed bundles are up-to-date.
```

可以查看已经安装的 sdk 版本(上面已经安装好 pepper_55-beta了)

安装最新版本的 SDK `./naclsdk install pepper_55`

```sh
~/Downloads/nacl_sdk at ☸️  kubernetes-admin@kubernetes
➜ ./naclsdk install pepper_55
Downloading bundle pepper_55
|================================================|  322945531
..................................................  322945/322945 kB
Updating bundle pepper_55 to version 55, revision 624
```

下载完毕之后可以看到 sdk 目录下增加了 `pepper_55` 文件夹, 里面有 各种的 例子,教程啥的



## 做点啥

想起来以前的 CoolQ 的 UDP 插件, 就做一个 webqq 算了, 如果可以就打算移植到 ChromeOS ~~(半桶水 C++警告⚠️)~~

> 这个只是闲的蛋疼, 有其他的 Coolq 插件可以直接把数据转发到 前端 上

### 新建项目

你从例子里面随意拷贝, 仿照一个

**关于在 Clion 里面无法补全的问题 (参考下方 `CmakeList.txt, 修改 SDK 地址`)**

```sh
cmake_minimum_required(VERSION 3.6)
project(web_qq)

set(CMAKE_CXX_STANDARD 17)
set(NACL_SDK /Users/haozi/Downloads/nacl_sdk/pepper_55)
include_directories(${NACL_SDK}/include)
link_libraries(${NACL_SDK}/include)

add_executable(web_qq socket.cc) // 不添加add_executable clion 无法 index 其他 lib
```

### 权限

在 `manifest.json`中添加

```json
  "permissions": [
    {
      "socket": [
        "tcp-listen:*:*",
        "tcp-connect",
        "resolve-host",
        "udp-bind:*:*",
        "udp-send-to:*:*"
      ]
    }
  ],
  "socket": {
    "udp": {
      "send": "*"
    },
    "udpServer": {
      "listen": "*"
    }
  }
```

### 处理 SOCKET


* 使用 HostResolver 处理地址

  * 这个地方和 Node 的 `dgram` 是不一样的, Node 不需要创建就可以发送, 但是 C++的需要
* 创建本地 UDP Sever 监听
* 接收信息
* 发送握手🤝信息

**下面所有的函数都是按顺序的, 一个 请求 一个 callback**,  收到信息之后调用 `PostMessage` 传递到前端页面

> 有一个注意的地方 对于 IP 地址有一个写法 `PP_NetAddress_IPv4 ipv4_addr = { 0, { 192, 168, 50, 126 } };` 但是这个实际是调用不了的, 不知道被发到啥地方去了 

> 我尝试加在`CFLAGS`了一个 `-std=c++14`以使用 `lambda`, 但是有些地方会报错, 就没使用了, 这个回调写的人很难受

> 部分代码来自 `/nacl_sdk/pepper_55/examples/api/socket`例子

```c_cpp
#include <stdio.h>
#include <string.h>
#include <sstream>

#include "ppapi/cpp/host_resolver.h"
#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/tcp_socket.h"
#include "ppapi/cpp/udp_socket.h"
#include "ppapi/cpp/var.h"
#include "ppapi/utility/completion_callback_factory.h"

#define CQ_PERFIX "CQ_"

const int kBufferSize = 40960;

class CoolQServer : public pp::Instance {
public:
    explicit CoolQServer(PP_Instance instance)
            : pp::Instance(instance),
              callback_factory_(this){
        // 直接开始解析地址, 链接服务器
        get_host_resolve("192.168.50.126:11235");
    }

    // 析构函数, 释放资源, 没啥释放的
    virtual ~CoolQServer() {
    }

    // 处理由 Chrome PostMessage 过来的信息
    virtual void HandleMessage(const pp::Var& var_message) {
        if (!var_message.is_string())
            return;
        std::string message = var_message.AsString();
        if (message == "say_hello") {
            say_hello();
            return;
        }
        send_message(message);
    }

protected:
    pp::UDPSocket udp_socket_;
    pp::HostResolver resolver_;
    pp::NetAddress remote_host_;
    char receive_buffer_[kBufferSize];

private:
    pp::CompletionCallbackFactory<CoolQServer> callback_factory_;

    //
    void get_host_resolve(const std::string& host) {
        udp_socket_ = pp::UDPSocket(this);
        resolver_ = pp::HostResolver(this);
        if (resolver_.is_null()) {
            PostMessage("Error creating HostResolver.");
            return;
        }

        int port = 80;
        std::string hostname = host;
        size_t pos = host.rfind(':');
        if (pos != std::string::npos) {
            hostname = host.substr(0, pos);
            port = atoi(host.substr(pos+1).c_str());
        }

        pp::CompletionCallback callback =
                callback_factory_.NewCallback(&CoolQServer::get_host_resolve_callack);
        PP_HostResolver_Hint hint = { PP_NETADDRESS_FAMILY_UNSPECIFIED, 0 };
        resolver_.Resolve(hostname.c_str(), port, hint, callback);
        PostMessage("Resolving ...");
    }

    // 上面函数的 回调
    void get_host_resolve_callack(int32_t result) {
        if (result != PP_OK) {
            PostMessage("Resolve failed.");
            return;
        }

        pp::NetAddress addr = resolver_.GetNetAddress(0);
        PostMessage(std::string("Resolved: ") +
                    addr.DescribeAsString(true).AsString());

        // 创建本地 UDP Server
        pp::CompletionCallback callback =
                callback_factory_.NewCallback(&CoolQServer::bind_local_server_callback);

        PostMessage("Binding ...");
        remote_host_ = addr;
        PP_NetAddress_IPv4 ipv4_addr = { 0, { 0 } };
        udp_socket_.Bind(pp::NetAddress(this, ipv4_addr), callback);
    }

    //创建本地 UDP Server 的回调
    void bind_local_server_callback(int32_t result) {
        if (result != PP_OK) {
            std::ostringstream status;
            status << "Connection failed: " << result;
            PostMessage(status.str());
            return;
        }
        PostMessage("本地 udp 创建成功");
        pp::NetAddress addr = udp_socket_.GetBoundAddress();
        PostMessage("SYSTEM:SUCCESS");

        // 接受信息
        receive_message();
    }

    // 发送握手信息
    void say_hello() {
        std::string host = udp_socket_.GetBoundAddress().DescribeAsString(true).AsString();
        std::string hostname = host;
        int port = 80;
        size_t pos = host.rfind(':');
        if (pos != std::string::npos) {
            hostname = host.substr(0, pos);
            port = atoi(host.substr(pos+1).c_str());
        }
        std::ostringstream hello;
        hello << "ClientHello " << port << " " << "192.168.50.231" ;
        send_message(hello.str());
        PostMessage(hello.str());
    }

    // 发送信息
    void send_message(const std::string& message) {
        uint32_t size = message.size();
        const char* data = message.c_str();
        pp::CompletionCallback callback =
                callback_factory_.NewCallback(&CoolQServer::send_message_callback);
        int32_t result;
        result = udp_socket_.SendTo(data, size, remote_host_, callback);
        std::ostringstream status;
        if (result < 0) {
            if (result == PP_OK_COMPLETIONPENDING) {
                status << "Sending bytes: " << size;
                PostMessage(status.str());
            } else {
                status << "Send returned error: " << result;
                PostMessage(status.str());
            }
        } else {
            status << "Sent bytes synchronously: " << result;
            PostMessage(status.str());
        }
    }

    // 发送信息的 回调
    void send_message_callback(int32_t result) {
        std::ostringstream status;
        if (result < 0) {
            status << "Send failed with: " << result;
        } else {
            status << "Sent bytes: " << result;
        }
        PostMessage(status.str());
    }

    // 接受信息
    void receive_message() {
        memset(receive_buffer_, 0, kBufferSize);
        pp::CompletionCallbackWithOutput<pp::NetAddress> callback =
                callback_factory_.NewCallbackWithOutput(
                        &CoolQServer::receive_message_callback);
        udp_socket_.RecvFrom(receive_buffer_, kBufferSize, callback);
    }

    // 接受信息的回调
    void receive_message_callback(int32_t result,
                                  pp::NetAddress source) {
        if (result < 0) {
            std::ostringstream status;
            status << "Receive failed with: " << result;
            PostMessage(status.str());
            return;
        }

        PostMessage(std::string(CQ_PERFIX) + ":" + std::string(receive_buffer_, result));
        receive_message();
    }
};


// 导出的 Module
class ExampleModule : public pp::Module {
public:
    ExampleModule() : pp::Module() {}
    virtual ~ExampleModule() {}

    virtual pp::Instance* CreateInstance(PP_Instance instance) {
        return new CoolQServer(instance);
    }
};


// 类似初始换函数, 可以被 Chrome 自动调用
namespace pp {
    Module* CreateModule() { return new ExampleModule(); }
}

```

### 编译

`make`

### 浏览器接收

这里没啥技术点, 主要是不能直接在 html 加载 `embed`标签, 原因是加载 nval 的时候你的 js 监听代码可能并没有被执行, 从而漏掉一些信息

```javascript
class CQServer {
    constructor() {
        this.load_nacl_plugin();
    }

    load_nacl_plugin() {
        this.cq_el = document.createElement('embed');
        this.cq_el.setAttribute('name', 'moto_native_cl');
        this.cq_el.setAttribute('id', 'moto_native_cl');
        this.cq_el.setAttribute('width', 0);
        this.cq_el.setAttribute('height', 0);
        this.cq_el.setAttribute('path', 'pnacl');
        this.cq_el.setAttribute('src', './pnacl/Release/web_app.nmf');
        this.cq_el.setAttribute('type', 'application/x-pnacl');
        this.cq_el.addEventListener('message', ({data}) => this.on_message(data))
        document.body.append(this.cq_el)
    }

    on_message(data) {
        if (data === "SYSTEM:SUCCESS") {
            this.heart_rate_service(true)
        }
        if (data.slice(0, 3) === "CQ_") {
            this.on_qq_message(data.slice(3, -1));
        }
    }

    send(raw_string) {
        this.cq_el.postMessage(raw_string);
    }

    heart_rate_service(immediately = false) {
        setTimeout(() => {
            console.log('心跳')
            this.send("say_hello");
            this.heart_rate_service();
        }, immediately ? 1 : 300000)
    }

    on_qq_message(raw_message) {
        console.log(`QQ 消息 -> ${raw_message}`)
    }
}


document.body.onload = () => {
    window.cq = new CQServer()
}
```



## 后

懒癌后期了, 当时 UI 库都挑好了, 现在懒得动手了 (🕊🕊🕊🕊🕊)