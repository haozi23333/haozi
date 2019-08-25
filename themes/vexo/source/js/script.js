(function ($) {
  console.log('© Theme-Vexo | https://github.com/yanm1ng/hexo-theme-vexo')
  var app = $('.app-body')
  var header = $('.header')
  var banner = document.getElementById('article-banner') || false
  var about = document.getElementById('about-banner') || false
  var top = $('.scroll-top')
  var catalog = $('.catalog-container .toc-main')
  var isOpen = false

  $(document).ready(function () {
    NProgress.start()
    $('#nprogress .bar').css({
      'background': '#42b983'
    })
    $('#nprogress .spinner').hide()

    var fade = {
      transform: 'translateY(0)',
      opacity: 1
    }
    if (banner) {
      app.css('transition-delay', '0.15s')
      $('#article-banner').children().css(fade)
    }
    if (about) {
      $('.author').children().css(fade)
    }
    app.css(fade)
  })

  window.onload = function () {
    setTimeout(function () {
      NProgress.done()
    }, 200)
  }

  $('.menu').on('click', function () {
    if (!header.hasClass('fixed-header') || isOpen) {
      header.toggleClass('fixed-header')
      isOpen = !isOpen
    }
    $('.menu-mask').toggleClass('open')
  })

  $('#tag-cloud a').on('click', function () {
    var list = $('.tag-list')
    var name = $(this).data('name')
    var maoH = list.find('#' + name).offset().top

    $('html,body').animate({
      scrollTop: maoH - header.height()
    }, 500)
  })

  $('.reward-btn').on('click', function () {
    $('.money-code').fadeToggle()
  })

  $('.arrow-down').on('click', function () {
    $('html, body').animate({
      scrollTop: banner.offsetHeight - header.height()
    }, 500)
  })

  $('.toc-nav a').on('click', function (e) {
    e.preventDefault()
    var catalogTarget = e.currentTarget
    var scrollTarget = $(catalogTarget.getAttribute('href'))
    var top = scrollTarget.offset().top
    if (top > 0) {
      $('html,body').animate({
        scrollTop: top - 65
      }, 500)
    }
  })

  top.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600)
  })

  document.addEventListener('scroll', function () {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    var headerH = header.height()
    if (banner) {
      if (scrollTop > headerH) {
        header.addClass('fixed-header')
      } else if (scrollTop === 0) {
        header.removeClass('fixed-header')
      }
    }
    if (scrollTop > 100) {
      top.addClass('opacity')
    } else {
      top.removeClass('opacity')
    }
    if (scrollTop > 190) {
      catalog.addClass('fixed-toc')
    } else {
      catalog.removeClass('fixed-toc')
    }
  })

})(jQuery)

/**
 * 这段代码来自
 * https://juejin.im/post/5c6d20b151882562934c9962
 */
const T_color = "";//字体颜色,你不设置就是随机颜色,

const T_size = [10, 20];//文字大小区间,不建议太大

const T_font_weight = "bold";//字体粗斜度-->normal,bold,900

const AnimationTime = 1500;//文字消失总毫秒

const Move_up_Distance = 388;//文字移动距离,正数代表上移，反之下移

let a_index = 0;
$("html").click(function(e){
  var a = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正" ,"法治", "爱国", "敬业", "诚信", "友善"];
  var $i = $("<span/>").text(a[a_index]);
  a_index = (a_index + 1) % a.length;
  const x = e.pageX, y = e.pageY;
  let x_color = "#" + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);//-->随机颜色
  //console.log(x_color);
  if(T_color.length>=4){
    x_color = T_color;
  }

  var x_size = Math.random()*(T_size[1]-T_size[0]) + T_size[0];
  x_size +=  "px";
  $i.css({
    "z-index": 99999,
    "top": y - 20,
    "left": x,
    "position": "absolute",
    "font-weight": "bold",
    "font-size":x_size,
    "color": x_color,
    "font-family": "'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif"
  });
  $("html").append($i);
  $i.animate({"top": y-Move_up_Distance,"opacity": 0},AnimationTime,function() {
    $i.remove();
  });
});
