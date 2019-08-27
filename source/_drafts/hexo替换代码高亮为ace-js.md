---
title: hexo替换代码高亮为ace.js
date: 2019-08-28 10:32:51
tags: 
	- hexo
	- 前端
---



# hexo替换代码高亮为ace.js

最近写前面的 k8s 笔记的时候发现 hexo 这个自带的代码高亮过于弱智, 很多格式的代码都无法做到正确的渲染, 在此将其替换为我认为最好的一个ace.js



{% githubCard user:ajaxorg repo:ace %}

<!--more-->



## 起

编辑 hexo 的配置文件, 将 highlight 的 enable 改为 false

```yml
highlight: 
	enable: false
```

重启 hexo serve, 可以看到, 代码部分渲染出来的格式

```html
<div class="sourceCode" id="cb1">
	<pre class="sourceCode yml">
		<code class="sourceCode yaml">
			<a class="sourceLine" id="cb1-1" title="1">
                <span class="fu">highlight:</span>
                <span class="at"> 
                </span>
            </a>
            <a class="sourceLine" id="cb1-2" title="2">    
                <span class="fu">enable:</span>
                <span class="at"> </span>
                <span class="ch">false</span>
            </a>
        </code>
    </pre>
</div>
```

```js
    const baseUrl = '//cdn.bootcss.com/ace/1.2.7/'
    if(document.getElementsByTagName('pre').length == 0) {
      console.log('Ace.js 未加载 -> 没有找到代码段')
      return
    }
    try {
      if (!window['ace']) {
        await this.getScript(baseUrl + 'ace.js')
        await this.getScript(baseUrl + 'ext-static_highlight.js')
      }
      console.log('Ace.js 加载完成')
      ace.config.set('basePath', baseUrl);
      const highlight = ace.require("ace/ext/static_highlight")
      const dom = ace.require("ace/lib/dom")
      new Array().map.call(document.querySelectorAll('pre code'), ((el) => {
        if (this.getAttr(el, 'ace-mode'))
          return
        const p = el.className.split(' ').map(v => v.replace(/ /g,''))
        this.setAttr(el, 'ace-mode', 'ace/mode/' + (p[1] || "plain_text"))
        this.setAttr(el, 'ace-theme', 'ace/theme/' + (p[2] || "chrome"))
        this.setAttr(el, 'gutter',  p[3] || true)
        highlight(el, {
          mode: el.getAttribute("ace-mode"),
          theme: el.getAttribute("ace-theme"),
          startLineNumber: 1,
          trim: true,
          showGutter: el.getAttribute("gutter")
        })
      }))
    } catch (e) {
      toasted.success('代码高亮加载失败, 请刷新 or pullRequest')
      throw e
    }
```

