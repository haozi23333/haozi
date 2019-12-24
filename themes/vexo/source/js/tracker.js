$(document).ready(() => {

  if (document.location.search.indexOf("disableTracker=true") > 1) {
    return
  }

  // if (!localStorage.getItem('disableTracker')) {
  //   return
  // } else if (localStorage.getItem('disableTracker') === false) {
  //   // 创建 询问窗口
  // }
  //
  //
  function ga_proxy() {
    if (document.location.href.indexOf('127.0.0.1') > -1 || document.location.href.indexOf('localhost') > -1) {
      console.log(`ga(`)
      console.log(arguments)
      console.log(`)`)
    } else {
      ga.apply(ga, arguments)
    }
  }

  (function () {
    /**
     * live2d 事件追踪
     */
    (() => {
      const timer = setInterval(() => {
        if (document.getElementById('live2d-widget')) {
          document.getElementById('live2d-widget').style['pointer-events'] = 'all'
          document.getElementById('live2d-widget').addEventListener('click', () => {
            ga_proxy('webui.send', 'event', 'click', 'Live2D', 1)
          })
          clearInterval(timer);
        }
      }, 1000);
    })();


    $(window).scroll(function(){
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        // 判断是否到达页面底部
        ga_proxy('webui.send', 'event', 'Scroll', 'Bottom', document.location.href)
      }
    });

    // Gitalk 状态
    setTimeout(() => {
      if ($('#comments').length > 0) {
        if ($('.gt-header-avatar').length > 0) {
          ga_proxy('webui.send', 'event', 'Gitalk', 'Login')
          // ga_proxy('webui.send', 'event', 'Gitalk', 'Login', $('.gt-user-name').text())
        } else {
          ga_proxy('webui.send', 'event', 'Gitalk', 'UnLogin')
        }
      }
    }, 5000)

    ga('content.send', 'event', 'look', document.location.href)


    if (document.referrer !== "") {
      const referrer = decodeURI(document.referrer)
      const parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
      const referrerParams = referrer.match(parse_url)
      // if(/20\d{2}/.test(referrer)) {
        ga_proxy('content.send', 'event', 'PrevPost', referrer, document.location.href)
      // }

      // 如果是 TAG 页面
      if (document.location.pathname === '/tags/') {
        ga_proxy('webui.send', 'event', 'click', 'tag', referrer, decodeURI(document.location.hash).replace('#', '') )
      }

      // 如果是翻页
      if (document.location.pathname.indexOf('/page/') > -1 && document.location.hostname === referrerParams[3]) {
        const nowPageNumber = parseInt(document.location.pathname.match(/(\d+)/g))

        if (referrerParams[5].indexOf('page/') > -1) {
          const prevPageNumber = parseInt(referrerParams[5].match(/(\d+)/g))
          if (nowPageNumber > prevPageNumber) {
            ga_proxy('webui.send', 'event', 'click', 'NextPage', referrer)
          } else {
            ga_proxy('webui.send', 'event', 'click', 'PrevPage', referrer)
          }
        }
        if (referrerParams[5] === "") {
          ga_proxy('webui.send', 'event', 'click', 'NextPage', referrer)
        }
      }

      if (referrerParams[5] === 'archives/') {
        ga_proxy('webui.send', 'event', 'click', 'Archives', decodeURI(document.location.pathname))
      }
    } else {
      ga_proxy('content.send', 'event', 'NoReferrer')
    }

    /**
     * 点击 RSS
     */
    $('.rss-href').on('click', _ => {
      ga_proxy('webui.send', 'event', 'click', 'rss-href')
    })

    // $('.header-container .right-list li').map((index, el) => {
    //   $(el).on('click', event => {
    //     ga_proxy('webui.send', 'event', 'Nav', 'Click', el.outerText)
    //   })
    // })

    if (document.location.pathname === '/links/') {
      $('#friends div a').map((index, el) => {
        $(el).on('click', event => {
          ga_proxy('webui.send', 'event', 'click', 'FriendLink', el.href)
        })
      })
    }

  })()
})