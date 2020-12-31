hexo.extend.filter.register('after_render:html', function(data){
    const { config } = this;
    if (config.mode === 'local') {
        return data
    }
    data = data.replace(/<img.*?src="(.*?)".*?\/?>/g, (img, src, content) => {
        img = img.replace(/src="(.*?)"/ig, (url) => {
            if (url[5] === '/' &&  url[6] !== '/') {
                return url.replace(/"(.*)"/, `"//haozi-static.kangna.site$1"`)
            }
            return url
        })
        return img
    });
    return data;
});

hexo.extend.filter.register('before_post_render', function (doc) {
    const url_path = doc.permalink.match(/\..+?(\/.*)/)[1]
    doc.content = doc.content.replace(/<img.+?src="(.+?)".+?>/ig, (html, src) => {
        if (src.slice(0, 2) === './') {
            const [, title, ...path] = src.split('/')
            if (title === doc.permalink.split('/').slice(-2)[0] || title === doc.title) {
                console.log({title, path})
                return html.replace(src, url_path + path.join('/'))
            }
        }
        return html
    })
})