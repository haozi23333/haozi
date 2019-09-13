---
title: 如何下载bilibili音频区的音乐
date: 2019-09-13 21:16:25
tags:
	- 瞎搞
---



# 如何下载bilibili音频区的音乐

今天是回深圳的前夜, 想起飞机上无聊有什么事情可以消遣, 就想起了以前发现 bilibili 音频区上面有很多的歌在网易云上面是没有的(部分版权问题). 所以就有了今天这茬子事情了

{% githubCard user:haozi23333 repo:bilibili_audio_downloader %}



![yousa 打 call.gif](/sticker/yousa_da_call.gif)

<!--more-->





## 抓接口

这就不需要详细的说了(Charles 就行)

**Bilibili  音频区搜索接口**

**GET https://api.bilibili.com/audio/music-service-c/s**

### params

| 参数名      | 类型   | 说明           | 默认值 |
| ----------- | ------ | -------------- | ------ |
| page        | Number | 第几页         | 未知   |
| pagesize    | Number | 每页几条数据   | 未知   |
| search_type | String | 请填写 `music` | 未知   |
| keyword     | String | 搜索关键字     | 未知   |

### Return

```typescript
export declare module Bilibili_Audio {

    export interface PlayUrlList {
        quality: string;
        url: string;
    }

    export interface Result {
        review_count: number;
        pubdate: number;
        title: string;
        cover: string;
        mid: number;
        play_count: number;
        putdate?: any;
        type: string;
        id: number;
        sq_url: string;
        high_url: string;
        mid_url: string;
        low_url: string;
        writer: string;
        play_url_list: PlayUrlList[];
        up_name: string;
        author: string;
        song_attr: number;
        limit: number;
        limitdesc: string;
        pgc_info?: any;
    }

    export interface Data {
        code: string;
        seid: string;
        page: number;
        pagesize: number;
        msg: string;
        result: Result[];
        easy?: any;
        num_pages: number;
    }

    export interface RootObject {
        code: number;
        msg: string;
        data: Data;
    }

}

```

`Bilibili_Audio.RootObject.Data.Result.play_url_list` 就是我们想要的数据了

```json
     {
                "review_count": 3,
                "pubdate": 1536470474,
                "title": "【泠鸢yousa】突然好想你",
                "cover": "http://i0.hdslb.com/bfs/music/227f2c742ad3b54129b283272a1f4725d8cd22bf.jpg",
                "mid": 8037603,
                "play_count": 408,
                "putdate": null,
                "type": "music",
                "id": 509467,
                "sq_url": "",
                "high_url": "",
                "mid_url": "",
                "low_url": "",
                "writer": "泠鸢yousa",
                "play_url_list": [
                    {
                        "quality": "192kbps",
                        "url": "http://upos-hz-mirrorbsy.acgvideo.com/ugaxcode/i180909wscmxgktvqgq671zashdj35rq-192k.m4a?um_deadline=1568390690&rate=50000&oi=2130706433&um_sign=389fbe70347b58cfe879443c7d61e8e8"
                    },
                    {
                        "quality": "128kbps",
                        "url": "http://upos-hz-mirrorbsy.acgvideo.com/null?um_deadline=1568390690&rate=50000&oi=2130706433&um_sign=da7b23f445b9fc60970aab4ac7fcfe6f"
                    }
                ],
                "up_name": "泠鸢yousa",
                "author": "泠鸢yousa",
                "song_attr": 0,
                "limit": 0,
                "limitdesc": "",
                "pgc_info": null
            }
```



## 搜索音乐

```typescript

/**
 * 搜索音乐
 * @param keyword   关键词
 * @param page      页码
 * @param page_size 每页返回数量
 */
export const search_audio = async (keyword = '泠鸢 yousa', page = 1, page_size = 20) => {
    return axios.get<Bilibili_Audio.RootObject>(`https://api.bilibili.com/audio/music-service-c/s`, {
        params: {
            page,
            pagesize: page_size,
            search_type: 'music',
            keyword
        }
    })
}
```

## 处理和下载音乐
```typescript
import {Bilibili_Audio, search_audio} from "./api";
const fs = require('fs')
const request = require('request');
const progress = require('request-progress');
import ora from 'ora'


let spinner = ora('欢迎使用 ~').start();

/**
 * 获取音频列表
 * @param keyword       关键词
 * @param max_page      最大搜索页码
 * @param page          当前页码
 * @param audio_list    搜索数组
 */
async function get_audio_list(keyword,  max_page = 10, page = 1, audio_list = []): Promise<Bilibili_Audio.Result[]> {
   spinner.text = `正在🔍关键词 ${keyword}, 第 ${page} 总 ${max_page}页, 已找到 ${audio_list.length} 条`
   const { data } = await search_audio(keyword, page);
   if (data.code === 0) {
      data.data.result.map((audio) => {
         if (audio.author === '泠鸢yousa') {
            audio_list.push(audio)
         }
      })
   }

   if (data.data.num_pages === page || page === max_page) {
      return audio_list;
   }

   return get_audio_list(keyword, max_page, page + 1, audio_list)
}

/**
 * 下载音乐
 * @param url           地址
 * @param file_name     文件名
 */
async function download_audio(url, file_name) {
   return new Promise((s, j) => {
      let size = 0;
      progress(request(url)).on('progress', (p) => {
         size = Math.round(p.size.total / 1024 / 1024)
         spinner.text = `${file_name}: ${ size }MB, (${Math.round(p.size.transferred / p.size.total)} %)`
      }).on('end', function (p) {
         spinner.succeed(`${file_name}: ${ size }MB 下载完成`)
         spinner.stop();
         s()
      }).pipe(fs.createWriteStream(`./songs/${file_name}`))
   })
}

(async () => {
   const keyword = '泠鸢yousa'
   spinner.text = `正在🔍关键词 ${keyword}`
   const array = await get_audio_list(keyword, 2);
   spinner.succeed(`🔍 搜索完成, 共找到 ${array.length} 条歌曲, 开始下载`)
   spinner.stop();
   await Promise.all(array.map(async (audio) => {
      // 这里挑选最好的音质
      const data = audio.play_url_list.sort((a, b) => parseInt(a.quality) > parseInt(b.quality) ? 0 : 1).shift();
      await download_audio(data.url, `${audio.title}_${data.quality}.flac`)
   }))
})()

```



## 后

有时间做成 cli 调用的版本