---
title: 基于 OpenResty 实现一个超级简单的随机图片服务
date: 2020-12-10 21:22:01
tags:
 - OpenResty
 - Lua
---



最近为了回击 @yangger, 想起来我有个tg频道

{% asset_img tg_name.png tg频道%}



里面收录了各种的 yangger 口嗨的记录, 包括且并不限于

{% asset_img kouhai.png 口嗨%}





有了这么多素材, 就打算做一个随机可以出随机图片的接口拿来整🔥

<!--more-->

## 当时的几个想法

* 当时是打算用 fass 来做的, 但是想起来又要去看文档, 还得交CDN的钱, 项目配好就没整了
* 自己 nodejs 写个服务
  * 有点麻烦了
* 利用 OpenResty 的 Lua 脚本来做



## OpenResty 的 Lua

主要是要注意

* 使用  `content_by_lua_block `

* 使用 `default_type` 设置一下返回数据的类型

* 我的图片是统一放在 `/root/static/*****/wechat_pic/` 这个目录下的.  并且是有序的名字. 从 `1-207`,所以直接拼接读取返回

* 如果你里面的是一些没规律的名字, 就需要先读取一下文件目录.  再随机返回文件名. 读取

  

```lua
location = /***** {
    default_type image/jpeg;
    content_by_lua_block {
        local file,err = io.open('/root/static/*****/wechat_pic/' .. math.random(207) .. '.jpg', 'r')
        if not file then
            ngx.say('pic not found')
        end
        while true do
            data = file:read(1024)
            if nil == data then
                break
            end
            ngx.print(data)
            ngx.flush(true)
        end
        file:close()
    }
}
```



## 展示

图片没脱敏, 就不放了





