const http = require('http')
const exec = require('child_process').exec
const axios = require('axios')

const bot_token = 'bot_token'
const chat_id = 'chat_id'
let   base_message = new Date().toLocaleString() + '站点 haozi.moe '

http.createServer(function (req, res) {
        // 该路径与WebHooks中的路径部分需要完全匹配，实现简易的授权认证。
        if(req.url === '/rebuild'){
        // 如果url匹配，表示认证通过，则执行 sh ./deploy.sh
                exec('sh ./deploy.sh', (error, stdout, stderr) => {
                        let notification = base_message + '已部署完毕'
                        if (error) {
                                notification = base_message + '部署失败 \n' + stderr
                        }
                        axios.get(`https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(base_message)}`).then(v => console.log('ok'))
                })
        }
        res.end()
}).listen(4002)