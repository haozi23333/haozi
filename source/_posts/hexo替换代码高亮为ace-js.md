---
title: hexo替换代码高亮为ace.js
tags:
  - hexo
  - 前端
date: 2019-08-28 10:32:51
---




# hexo替换代码高亮为ace.js

最近写前面的 k8s 笔记的时候发现 hexo 这个自带的代码高亮过于弱智, 很多格式的代码都无法做到正确的渲染, 在此将其替换为我认为最好的一个ace.js



{% githubCard user:ajaxorg repo:ace %}

<!--more-->



## 起

编辑 hexo 的配置文件, 将 highlight 的 enable 改为 false

```yaml
highlight: 
	enable: false
```

重启 hexo serve, 可以看到, 代码部分渲染出来的格式

```html
<pre>
	<code class="yaml">highlight: 
    enable: false</code>
</pre>
```

## 实现

### 设置高亮

代码不是很复杂,直接看注释就行

```javascript
(async () => {

  if(document.getElementsByTagName('pre').length === 0) {
    console.log('Ace.js 未加载 -> 没有找到代码段');
    return;
  }

  const base_url = '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.5/';

  const get_script = function (url) {
    return new Promise((s, j) => {
        $.getScript(url, s, j );
    })
  };

  // 判断一下 ace 是否已经加载完成, 没有就再加载
  if (!window['ace']) {
    // 预加载2个JS文件
    await get_script(base_url + 'ace.js');
    await get_script(base_url + 'ext-static_highlight.js');
  }

  console.log('Ace.js 加载完成');

  // 这里设置ace加载解析器的基础地址, 自己部署的话设置为自己ace.js组件的地址, 这里使用的是CDN的
  ace.config.set('basePath', base_url);
  const highlight = ace.require("ace/ext/static_highlight");

  // 搜索 pre code 解构的块, 进行着色
  [].map.call(document.querySelectorAll('pre code'), ((el) => {
    // 如果已经被设置了ace-mode的话, 这个块已经是被高亮过了, 就不重复了
    if (el.getAttribute( 'ace-mode'))
      return;
    // 拆分class
    const p = el.className.split(' ').map(v => v.replace(/ /g,''));
    console.log(p)
    // 这里是设置着色的语言
    el.setAttribute('ace-mode', 'ace/mode/' + (p[0] || "plain_text"));
    // 这里可以修改主题颜色
    el.setAttribute('ace-theme', 'ace/theme/solarized_light');
    el.setAttribute('gutter',  p[3] || true);
   highlight(el, {
      mode: el.getAttribute("ace-mode"),
      theme: el.getAttribute("ace-theme"),
      startLineNumber: 1,
      trim: true,
      showGutter: el.getAttribute("gutter"),
      fontFamily: "Fira Code",
    });
  }));
})();
```



### 修改表现

这里直接修改CSS, `ace_static_highlight`这个class就是控制高亮的, 修改它的表现就行了

```css
 .ace_static_highlight
  font-family: "Fira Code Light"
  font-size: 14px
```

