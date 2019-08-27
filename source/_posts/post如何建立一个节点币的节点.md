---
title: 如何建立一个节点币的节点
date: 2018-03-24 02:55:12
tags:
    - Coin
    - Master Node
---

## 准备阶段

* 一台Vps, 最好是国外的
    - 内存 大于或等于 1G 内存 2G最好
    - Cpu 无要求
    - 系统 
        - linux ubuntu 版本大于等于 14.04
        - window server 版本大于等于 2008 
    - 网络要好
* 你所要搭建的节点币的担保币, 比如 `CoreZ = 2000个`, `WAVI = 1000个` 最好一般多放一点

###  创建虚拟内存
> **真实内存大于或等于2G的可以不做**

ssh 到你的服务器
运行以下命令， 创建并启用虚拟内存(交换分区)
```sh
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile  
```
使用root权限编辑 `/etc/fstab` 文件，添加以下命令， 使其开机自动挂载
```sh
/swapfile none swap defaults 0 0
```

## 添加节点配置
回到你的GUI钱包, 选择工具(Tools)选项 -> 调试(Debug console) 切换到 Console 选项卡， 输入下面的命令 回车
```sh 
getnewaddress  <节点名字>
```
可以获得一个类似于 `ZorZXzwaJXizWiGLRWVYwdcPV1qj4Z757u` 的地址， 你需要向这个地址发送大于担保值的币，多一点点就好了。不用担心币不见了，因为这个地址是你自己的，等待一定的确认次数币到账
继续在 Console 界面输入下面的命令， 回车
```sh
masternode genkey
```
你可以拿到一个类似 `5rRvBWi5jRgLk9ef2nhomN9pqXsZC5kUEW4rJ5Bp8RHKZojc5mq` 这样的地址， 你需要把这个记录下来标记为 节点key
继续在 Console 界面 输入
```sh
masternode outputs
```
得到一个类似的输出
```json
{   
    "5ed1b5d8cf927ab6db888b41977ac6139dc26eb3e6d1d6afec4306bb85055ff5": "0", 
} 
```
将里面的 `5ed1b5d8cf927ab6db888b41977ac6139dc26eb3e6d1d6afec4306bb85055ff5` 复制出来 标记为 节点输出
关闭窗口， 选择钱包的 工具(Tools)选项 -> 打开节点配置文件(Open MasterNode Configuration File)
在弹出的编辑器中输入， 会用到上面记录的 节点key 和节点 输出
```sh
<节点名字> <节点ip>:<节点端口> <节点key> <节点输出> <节点序号>
```
例如上面的就是
```sh
NM1 0.0.0.0:36655 5rRvBWi5jRgLk9ef2nhomN9pqXsZC5kUEW4rJ5Bp8RHKZojc5mq 5ed1b5d8cf927ab6db888b41977ac6139dc26eb3e6d1d6afec4306bb85055ff5 0
```
节点ip就是您vps的ip， 端口可以随便设置一个

## Linux 启动 Master Node
ssh 到您的服务器
更新软件包列表
```sh
sudo apt-get update
```

### 获取守护进程
如果在官方下载链接上面出现了 linux 钱包可以先下载下来看看是否存在一个文件结尾为d的文件比如 `corezd` `wavid` 等如果没有的话， 需要参照下方教程

创建服务器节点配置文件
创建一个叫做`masternode.conf`的文件 输入以下
```sh
listen=1 
server=1 
daemon=1 
masternode=1
rpcallowip=127.0.0.1 
maxconnections=256 
externalip=<你的ip地址>:<你上面选的端口号> 
masternodeprivkey=<上面生成的节点key> 
rpcuser=<用户名> 
rpcpassword=<一个稍微复杂的密码> 
```
开放服务器的端口, 让其他节点可以连接到我们
运行命令
```sh
sudo ufw allow <你上面选的端口号>/tcp
```
解压您的linux钱包， 找到上面说的文件，运行
```sh
./<守护进程名> --conf=<配置文件>
```
例如
```sh
./corezd --conf=/home/ubuntu/masternode.conf
```
你将会看到一条 `corez server starting` 的消息
返回到您的钱包

## 开启节点
选择钱包的 MasterNode 选项，点击 Start All 选项
如果你没有看到 MasterNode 选项，选择设置(Setting) -> 选项(Option) 切换到 钱包(Wallet) 选项卡， 将显示MasterNode选项(Show MasterNode Tab) 前面打上勾 并重启钱包
等待节点的 Status(状态) 变为 ENABLE(开启), 就算是启动完成了


## 注意
不要将你的 节点钱包的币转出， 一旦转出你的节点会被暂停

