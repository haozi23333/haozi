---
title: redis资源池
date: 2019-12-20 3:26:47
tags:
	- 笔记
---

# 用 Redis 做资源池

最近在爬取一些比较感兴趣的的数据,  但是数据接口做了权限校验, 而且做了单端登录(不能同时请求, 同一个token 同一时间只能请求一个, 用的是 Websocket 协议). 比较麻烦. 我各个节点之间用的是 Redis 做的通信, 所以 继续用 Redis  做一个资源池用来分配调用权限

![哈欠](/sticker/pa.png)

<!--more-->

## 实现

其实是就以下几步

* Master 节点初始化
  * 拉取数据库保存的爬虫用户信息, 加入到 Redis 缓存
  * 查询是否用户信息是否被占用, 没有占用的话加到 spiderUserPool 队列中
* Master 节点维护信息
  * 定时检查所有已经使用的 Key 是否已经被释放(检查 lock ), 如果释放了 加入到资源池



* Cluster 节点使用
  * 弹出资源池资源ID, 
  * 校验是否被占用
  * 拉取缓存信息
* Cluster 节点释放
  * 退出释放锁

### 缓存数据

```typescript
async cacheAllUser() {
    // 拿到所有的资源, 如果资源比较多, 可以分批加载
    const spiderUsers = await SpiderUser.find({});
    // 删除旧的缓存集合
    await redis.del(redisKeys.spiderUserCache())
    
    for(let i = 0; i < spiderUsers.length; i++) {
        const phone = spiderUsers[i].phone
        // 缓存用户信息, key 是用户唯一ID
        await redis.hset(redisKeys.spiderUserCache(), phone + '' , JSON.stringify(spiderUsers[i].toJSON()))
        // 查询是否已经使用
        if (!await redis.exists(redisKeys.spiderUserUsedLock(phone + ''))) {
            // 没使用会被加到pool
            await redis.sadd(redisKeys.spiderUserPool(), phone + '')
        }
    }
}
```

### 获取资源

```typescript
async getUserInfo() {
    // 从 Redis 拉取用户信息
    const phone = await redis.spop(redisKeys.spiderUserPool())
    if (!phone) {
        await this.log(`没有可用用户`)
        process.exit(0)
    }
    // 查询缓存
    this.user = await redis.hget(redisKeys.spiderUserCache(), phone);
    if (!this.user) {
        await this.log(`用户不存在 ${phone}`)
        process.exit(0)
    }
    if (await redis.exists(redisKeys.spiderUserUsedLock(phone))) {
        await this.log(`用户被占用 ${phone}`)
        process.exit(0)
    }
    // 每10 秒创建这个锁
    setInterval(async () => {
        await redis.set(redisKeys.yunxinRoomConnectedLockKey(this.room_id), 1, 'EX', 12);
    }, 10 * 1000)
    this.user = JSON.parse(this.user)
}
```

### 主动释放

```typescript
// 资源使用完毕之后主动释放
async freeUser(userId: string) {
    await redis.del(redisKeys.spiderUserUsedLock(userId)
}
```

### 被动释放

```typescript
// 程序意外退出, 未主动释放, 定时检测交换资源池
async freeUsedUser() {
    // 获得所有用户的ID
    const users = await redis.hkeys(redisKeys.spiderUserCache());
    // 获得资源池还未被分配的 ID
    const unUsed = await redis.smembers(redisKeys.spiderUserPool());
    // 求差集(已经被占用的)
    const difference = [users, unUsed].reduce((a, b) => a.filter(c => !b.includes(c)));
    for (let i = 0; i < difference.length; i++) {
        const phone = users[i]
        // 查询是否被占用
        if (!await redis.exists(redisKeys.spiderUserUsedLock(users + ''))) {
            // 交还给资源池
            await redis.sadd(redisKeys.spiderUserPool(), phone + '')
        }
    }
}
```

## 后

如果有更好的办法也可以留言告诉我