---
title: rust遇上node
date: 2019-11-05 00:49:51
tags:
	- rust
	- Nodejs
---

​	

# rust遇上node

最近在写那个终端的播放器, 遇到了一个大难题 **¿怎么在 Nodejs 里面放音乐呢**, 要知道扬声器可是硬件,Nodejs 只是运行于 V8 的脚本

![擦汗.png](/sticker/cahan.jpg)

在 Github 上面搜了一堆的 nodejs 播放器的实现, 都是调用本地播放器进行播放的, 这个问题就比较大不容易跨平台, 所以还是得自己写一个



<!--more-->



## 寻找音频库

学了这么久的 Rust 还没实打实的应用过, 所以就打算用 Rust 来做和底层交互的语言, 在 crates 上面找了一会儿发现了这么的一个库, 

{% githubCard user:nickbrowne repo:ears %}

虽然是一个用来做游戏的音频库, 调用的是 OpenAL 的接口, 虽然接口不是很全, 但是这玩意的依赖好装啊拿来开发测试还是很不错的

## neon

这没啥好说的用来 rust 和 node 绑定的

{% githubCard user:neon-bindings repo:neon %}



## 编写

用  neon 创建一个新项目,  加上依赖

```toml
[dependencies]
ears = "0.7.0"
```

主要用的就是 ears 的 `Music`这个类

先创建一个 `struct`

```rust
extern crate ears;
use ears::{Sound, Music, AudioController, State};
pub struct MusicPlayer {
    pub sound: Music
}
```

用 `declare_types!`这个宏创建类,  `init`函数会被翻译为`constructor`

```rust
declare_types! {
    pub class JSMusicPlayer for MusicPlayer {
        init(mut cx) {
          	/// 获取JS 传递过来的参数, 转换到 JsString 类型
            let mut path = cx.argument::<JsString>(0)?;
          	/// 创建 Music 对象实例
            let mut snd = Music::new(&(path.value() as String)).unwrap();
            Ok(MusicPlayer {
                sound: snd
            })
        }
     }
}
```

再把其他的函数都给 export 到 JS

```rust
declare_types! {
    pub class JSMusicPlayer for MusicPlayer {
        init(mut cx) {
            let mut path = cx.argument::<JsString>(0)?;
            let mut snd = Music::new(&(path.value() as String)).unwrap();
            Ok(MusicPlayer {
                sound: snd
            })
        }

        method play(mut cx) {
            {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.play();
            };
            Ok(cx.undefined().upcast())
        }

        method pause(mut cx) {
            {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.pause();
            };
            Ok(cx.undefined().upcast())
        }

        method stop(mut cx) {
            {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.stop();
            };
            Ok(cx.undefined().upcast())
        }

        method get_volume(mut cx) {
            let mut volume = {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.get_volume()
            } as f64;
            Ok(cx.number(volume).upcast())
        }

        method set_volume(mut cx) {
            let mut volume_str = cx.argument::<JsString>(0)?;
            {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.set_volume(f32::from_str(&(volume_str.value() as String)).unwrap())
            }
            Ok(cx.number(1).upcast())
        }

        method is_playing(mut cx) {
            let mut is_playing = {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.is_playing()
            };
            Ok(cx.boolean(is_playing).upcast())
        }

        method set_looping(mut cx) {
            let mut looping = cx.argument::<JsBoolean>(0)?;
            {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.set_looping(looping.value())
            }
            Ok(cx.boolean(looping.value()).upcast())
        }

        method is_looping(mut cx) {
            let mut is_looping = {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.is_looping()
            };
            Ok(cx.boolean(is_looping).upcast())
        }

        method get_state(mut cx) {
            let mut state = {
                let mut this = cx.this();
                let guard = cx.lock();
                let mut music = this.borrow_mut(&guard);
                music.sound.get_state()
            };
            match state {
                State::Initial => Ok(cx.string("Initial").upcast()),
                State::Playing => Ok(cx.string("Playing").upcast()),
                State::Paused  => Ok(cx.string("Paused").upcast()),
                State::Stopped => Ok(cx.string("Stopped").upcast()),
                _ => Ok(cx.string("Error").upcast())
            }
        }

    }
}
```

可以看到里面的获取所有权的重复代码还是很恶心的,  JS 的 number 类型在 rust 里面为 `f64`, 但是莫得任何简单的办法直接从 `f64` -> `f32`, 所以让 JS 传过来的`String`类型的值, 然后`f32::from_str`直接转换

由于是游戏的音频库, 所以里面有很多关于音频位置的骚玩法, 有兴趣的可以自己把里面的[set_position](https://docs.rs/ears/0.7.0/ears/trait.AudioController.html#tymethod.set_position)等函数导出自己玩玩



## build

```sh
neon build --release 
```

直接运行

{% asset_img p1.png 运行效果 %}

很棒的 true music 🎵



## 后

还是整了一个备用方案, 打开之后启动一个 webserver, 打开浏览器链接, 在上面放一个 audio标签, 用 websocket 控制, 完全不需要做跨平台兼容 hhhhh