---
slug: 2020/09/08/Jenkins钉钉插件
title: Jenkins钉钉插件使用自定义变量
authors: haozi
tags: [DevOps, 笔记]
date: 2020-09-08 06:48:58
---



# Jenkins钉钉插件使用自定义变量

正好在给公司的一个 Electron 项目做自动化发布, 打包流程搞定了, 需要把构建完成的信息推送到公司钉钉群内. 

Jenkins 内正好也有一个钉钉推送插件([DingTalk 机器人通知](https://plugins.jenkins.io/dingding-notifications/)), 但是使用下来发现了一些问题, 我需要把构建的 Commit Message 和上传到 OSS 的构建完成的文件地址, 发到工作群内. 遇到了一些奇奇怪怪的问题



![表情](./Jenkins钉钉插件/file_6039503.png)



<!--truncate-->

## 兼容问题

我为了使用 `minio` 的插件, 将 Jenkins 升级到了 `2.243`, 发现钉钉插件挂了, 具体表现就是 系统配置里面没有 钉钉的配置项.

**解决办法**

将 钉钉插件降级,  `2.3.2` -> `2.3.1`

~~我也不知道为什么就可以, 瞎整整对了~~



## GIT_COMMIT 变量不存在

这个查了一下 很迷, pipeline 内 git 调用之后环境变量没被赋值, 所以得换个办法



```groovy
script {
  def git_var = checkout([
    $class: 'GitSCM',
    branches: [[name: '*/master']],
    userRemoteConfigs: [[
      credentialsId: 'github-haozi23333',
      url: 'https://github.com/xxxxxxx/xxxxxx'
    ]]])
  env.GIT_COMMIT = git_var.GIT_COMMIT
}
```

用 script 去执行 checkout (git 命令不行), 会返回全部需要的环境变量.  这时候把它赋值回 `env`, 这时候就可以在任何地方调用了



## 获取 COMMIT_MESSAGE

获取指定的 `CIT_COMMIT` hash 的提交信息, 写入到环境变量 `COMMIT_MESSAGE`

```groovy
script {
  env.COMMIT_MESSAGE = sh(script:"git --no-pager show -s -n 1 --format='%B' ${GIT_COMMIT}", returnStdout: true).trim()
}
```

加一个 trim 是因为 returnStdout 会多一个空格 

## 钉钉支持自定义环境变量

这一步我当时试了很久, 各种姿势都试过了. issue 里面作者说了支持, 反正我没试出来

把钉钉插件的 debug 模式开一下, 看一下构建的日志, 会发现插件在加载的时候, 会把全部的环境变量 log 出来. 根据测试. 插件在 pipeline 开始的时候就会把所有的环境变量保存在自己的插件内.**即使你在后面修改了环境变量, 也不生效**, 也不会加载任何自定义的变量

所以我把目光又双叒转向了 `script`

```groovy
script {
  def message = """构建 ID ${BUILD_DISPLAY_NAME}
当前 GIT 版本:  ${env.GIT_COMMIT}
构建产物下载地址: https://oss.haozi.cool/haozi-static/xxxxx/${ARCHIVE_FILENAME}
构建说明: ${env.COMMIT_MESSAGE}"""
   dingtalk (
            robot: 'xxxxxxx-xxxx-xx-xxxx-xxxx',
            type: 'TEXT',
            text: [
                message
            ]
        )
}
```

对! 没错, 我们在 `script` 里面拼接好要发送的字符串, 再以变量的形式交给 dingtalk, 这时候就可以发送正常了


## ~
第一次用 Jenkins 有点难顶, 幺蛾子有点多, minio 的插件还得自己 build, 各种东西都要配置
