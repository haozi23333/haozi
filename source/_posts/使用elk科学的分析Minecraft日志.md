---
title: 使用elk科学的分析Minecraft日志
date: 2019-10-11 12:37:43
tags:
	- es
	- 大数据
	- 瞎搞
	- Minecraft
---



# 使用elk科学的分析Minecraft日志[1]

最近除了投简历也没啥事情做, 闲的蛋疼, 刚搭好了 es 丢哪里白白占着内存还不如利用起来, 这次还是那 Minecraft 的数据开刀, 这次先是原始的日志. 



{% asset_img log.png log日志 %}

<!--more-->



## 目的

使用elk分析mc日志主要有3个目的

* 问题排查
* 监控预警

* 数据分析



## 日志文件

Minecraft 服务器的日志只需要分析 `latest.log`就行, 我们服务器的服务端`Uranium` (万年1.7.10)

{% githubCard user:Ultimaker repo:Uranium %}

这里我们对日志的格式进行一个处理, 我们进行修改logstash配置时, 需要经常重新导入日志进行重新index. 添加一个日期方便回溯原始文件(**不处理也行**)

```
# 原始日志
[17:13:05] [Server thread/INFO]: Unloading dimension 8
[17:13:05] [Server thread/INFO]: Unloading dimension 2

# 添加日期
[2019-10-10:17:13:05] [Server thread/INFO]: Unloading dimension 8
[2019-10-10:17:13:05] [Server thread/INFO]: Unloading dimension 2
```

使用7zip 右键以打开压缩包的方式打开`Uranium-dev-5-B271.jar`(如果是其他的端, 也是一样), 修改里面的 `log4j2.xml`

* 将里所有的 `[%d{HH:mm:ss}]`修改为`[%d{yyyy-MM-dd:HH:mm:ss}]`增加年月日的信息, 
* 调整 `logs/latest.log` 的`RollingRandomAccessFile`, 如果需要及时的将log传递给es需要增加一个 `immediateFlush="true"`(出现日志立即刷新到磁盘)的属性(据说这个属性性能损失大), 或者设置一个较小的`buffer`

然后把修改好的文件, 丢回到jar包里面



## Logstash 配置

安装过程忽略, 这个是对部分常用日志进行了针对的处理

* 玩家登陆,离开信息, 执行命令, 发言消息
* TPS, 实体, Tick, Tiles  (定时执行 gc, um tps 等命令)
* 报错信息

```groovy
input{
    file {
      path => [
        "D:/Craft_Townlet/logs/latest.log"
        ]
      start_position  => "beginning"
      # window 中文日志 必须 gb2312
      codec => plain {
        charset => "GB2312"
      }
    }
}
filter {

  mutate {
    # 有些神奇的mod和插件， 会使用 shell color, 为了在kibaha里面好看一点就过滤掉, 一定要先过滤掉
    gsub => ["message", "(\x1B)\[[0-9;:]*[a-zA-Z]", ""]
  }

  grok {
    # 处理时间格式， 以及LOG LEVEL和异常位置
    match => {
      message => "\[(?<logdate>.+?)\]\s\[(?<type>.+?\s)?(?<thread>.*)\/(?<level>.+?)\](\s\[(?<logger>.+?)?\/(?<mod>.+?)?\])?\:"
      add_tag => "mod"
    }
  }

  grok {
    # 服务器的加入游戏信息， 这时候还没有过Authme 验证
    match => [ "message", "UUID of player (?<name>.*) is (?<player_uuid>.*)" ]
    add_tag => [ "player", "join" ]
  }

  date {
    # 转换时间格式
    match => ["logdate", "yyyy-MM-dd:HH:mm:ss"]
    target => "@timestamp"
  }

  grok {
    # 扫地大妈的计数
    match => [ "message", "这次清理了(?<count>.+?)个垃圾,吾辈是不是很棒呢" ]
    add_tag => [ "cleaner" ]
  }

  grok {
    # 这个是tick超时给的提示 
    match => ["message", "Last server tick was (?<tick_timeout>.+?)ms ago"]
    add_tag => [ "tick_timeout" ]
  }

  grok {
    # 服务器给的丢失连接时候的信息, 包括mod有问题, 网络有问题之类的
    match => ["message", "\:\s(?<player>.*)\slost\sconnection: (?<reason>.*)"]
    add_tag => [ "player", "leave" ]
  }

  grok {
    # 每个人执行的命令
    match => ["message", "\:\s(?<player>.*)\sissued\sserver\scommand: (?<command>.*)"]
    add_tag => [ "player", "exec_command" ]
  }

  grok {
    # 每个人的发言
    match => [ "message", ":\s\[(?<world>.*)\](?<player>.*)\>\>(?<chat>.*)" ]
    add_tag => [ "player", "chat" ]
  }

  grok {
    # 统计Authme插件认证过的人
    match => [ "message", ":\s\[AuthMe\]\s(?<player>.*)\slogged in!" ]
    add_tag => [ "player", "logged" ]
  }

  grok {
    # 解析 um tps, 每个世界的 tick信息和平均tick时间
    match => [ "message", ":\s\[(?<world_id>.*)\]\s(?<world>.*)\s\|\s(?<world_saved>.*)\s-\s(?<avg_tick_time>.*)ms\s\/\s(?<tps>.*)tps" ]
    add_tag => [ "server", "tick_info" ]
  }


  grok {
    # 提取 lag / gc 命令返回的实体数量, 加载区块信息
    match => [ "message", ":\s(?<world>.*)-(?<saved>.*)\":\s(?<chunk>\d*).+?\s(?<entity>\d*).+?\s(?<tiles>\d*)" ]
    add_tag => [ "server", "chunk_info", "entity_info", "tiles_info" ]
  }


 grok {
    # 提取 Overall 关键字获取 tps信息
    match => [ "message", ":\sOverall\s\-\s(?<avg_tick_time>.*)ms\s\/\s(?<tps>.*)tps" ]
    add_tag => [ "server", "tick_info", "avg_tick" ]
  }

  grok {
    # 处理 gc / lag 命令返回的 内存使用情况
    match => [ "message", "\:\s空闲内存\:(?<free_memory>.*)Mb" ]
    add_tag => [ "server", "memory_info" ]
  }

  grok {
    # 处理 gc / lag 命令返回的 内存使用情况
    match => [ "message", "\:\s已使用内存\:(?<used_memory>.*)Mb" ]
    add_tag => [ "server", "memory_info" ]
  }

  grok {
	# 处理 gc / lag 命令返回的 内存使用情况
    match => [ "message", "\:\s最大内存\:(?<max_memory>.*)Mb" ]
    add_tag => [ "server", "memory_info" ]
  }
    
  mutate {
    # 处理数字中的千位分隔符
    gsub => ["free_memory", ",", ""]
    gsub => ["used_memory", ",", ""]
    gsub => ["max_memory", ",", ""]
    gsub => ["chunk", ",", ""]
    gsub => ["entity", ",", ""]
    gsub => ["tiles", ",", ""]
  }
  # 转换类型
  mutate {
    convert => ["tps", "float"]
    convert => ["avg_tick_time", "float"]
    convert => ["chunk", "integer"]
    convert => ["entity", "integer"]
    convert => ["tiles", "integer"]
    convert => ["count", "integer"]
    convert => ["world_id", "integer"]
  }
}
output{
   elasticsearch{
      hosts => ["https://es.haozi.local:443"]
      index => "mc_craft__log"
      # 自制的证书
      cacert => "D:\logstash-7.4.0\ca.cert.crt"
  }
}
```


## kibana

将日志导入到es后, 使用kibana随便查看一下信息

{% asset_img dashboard.png log日志 %}

效果还是蛮不错的



## 注意

要注意一点 `latest.log`这个文件, 服务器重启之后, 会重新创建, 但是! logstash 会记录上次读取到的位置,  所以说, MC服务端一旦重启需要手动删除`data\plugins\inputs\file\.sincedb_*`这些缓存文件, 重置读取进度, 然后重启 logstash 



