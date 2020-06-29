hexo.extend.filter.register('after_render:html', function(data){
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