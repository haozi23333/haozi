import React from "react"
import Layout from '@theme/Layout';
import './links.sass'
import {Col, Row} from "antd";
import { shuffle } from 'lodash'
import 'gitalk/dist/gitalk.css'
import GitalkComponent from "gitalk/dist/gitalk-component";
import BrowserOnly from '@docusaurus/BrowserOnly';

function Random({ children }) {

    return (
        <div className="random">
            {shuffle(children)}
        </div>
    )
}

function FriendList() {
  return (
    <div className={'friends f'}>
     <Random>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://www.mokeyjay.com">
           <object className="f_logo" data="https://www.mokeyjay.com/headimg.png" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">超能小紫</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://blog.desmg.com">
           <object className="f_logo" data="https://blog.desmg.com/wp/wp-content/uploads/2019/09/ahri.jpg"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>

           <span className="f_span">神林的博客</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://blog.conoha.vip/">
           <object className="f_logo" data="https://blog.conoha.vip/moe/favicon.jpg" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">RBQ🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://huangxin.dev">
           <object className="f_logo" data="https://ae01.alicdn.com/kf/H0b798980349e4042bd9dabb1acc79cb6U.jpg"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">惶心博客</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://chanshiyu.com/">
           <object className="f_logo" data="https://cdn.jsdelivr.net/gh/chanshiyucx/yoi/blog/avatar.jpg"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span" style={{ fontFamily: "GuDianMingChaoTi" }}>蝉時雨  -  蝉鸣如雨 花宵道中</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://lemonadorable.gitee.io/">
           <object className="f_logo" data="https://lemonadorable.gitee.io/img/avatar.png" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">自由灵的梦境  -  愿美梦成真</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://zankyo.cc/">
           <object className="f_logo" data="https://zankyo.cc/wp-content/uploads/2017/11/20171127_082530.jpg"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">我竟从未留意过，这个世界是如此的美丽。</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://crosschannel.cc">
           <object className="f_logo" data="https://crosschannel.cc/images/me.png" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">宅日记 - 一个不知名懒肥宅的自留地</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://spiritx.xyz">
           <object className="f_logo" data="https://view.spiritx.xyz/images/2019/01/11/Avatar.jpg" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">Spirit - 同学同道，终身相习</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://2heng.xin">
           <object className="f_logo" data="https://view.moezx.cc/images/2018/03/27/avatar.jpg" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">Mashiro - 樱花庄的白猫</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://hexiongbiao.cn/">
           <object className="f_logo" data="https://pandaoh.github.io/images/avatar.jpg" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">DoubleAm - Swag 江湖码头，Web 开发者的暖心加油站 ~</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://touko.moe/">
           <object className="f_logo" data="https://blog.yuzu.im/favicon.ico" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">Netrvin</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://www.project-sophia.jp/">
           <object className="f_logo"
                   data="https://secure.gravatar.com/avatar/3d172d73faafecee48fe5d44ecd4e8e0?s=100&r=R&d="
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">metheno</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://diygod.me//" style={{}}>
           <object className="f_logo"
                   data="https://cdn.jsdelivr.net/gh/DIYgod/hexo-theme-sagiri/source/images/DIYgod-avatar2.webp"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">
                        <div style={{
                          textShadow: "1px 1px 0 #ff3f1a, -1px -1px 0 #00a7e0", color: "white", float: "left"
                        }}>
                            <span
                              style={{left: "519.609px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>H</span>
                            <span
                              style={{left: "612.609px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>i</span>
                            <span
                              style={{left: "653.719px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>,</span>
                            <span
                              style={{left: "694.625px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}> </span>
                            <span
                              style={{left: "720.438px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>D</span>
                            <span style={{left: "806.25px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>I</span>
                            <span style={{left: "854.25px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>Y</span>
                            <span
                              style={{left: "936.156px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>g</span>
                            <span
                              style={{left: "1008.77px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>o</span>
                            <span
                              style={{left: "1084.27px", opacity: 1, transform: "matrix(1, 0, 0, 1, 0, 0)"}}>d</span>
                            <span style={{color: "#00a7e0", textShadow: "none"}}>
                              写代码是热爱，</span><span style={{
                          color: "#ff3f1a", textShadow: "none"
                        }}>写到世界充满爱！</span>
                        </div>
                    </span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://2890.ltd/">
           <object className="f_logo" data="https://cdn.2890.ltd/d74a3de2bf526638b867b62f2caccda8.jpeg"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">OK Yes!技术博客 - 念念不忘，必有回响</span>
         </a>
       </div>
       <div className="moedog">
         <a target="_blank" rel="noopener noreferrer" href="http://moedog.org">
           <object className="f_logo" data="https://gravatar.loli.net/avatar/5e6892e999ca8c85a358d21164167f38?s=128"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">犬's Blog - I'm very vegetable and very poor.</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://eee.dog/">
           <object className="f_logo" data="https://cdn.yimian.xyz/img/head/head2.png" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">呓喵酱のBlog - 跻身世外，随欲而安</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://sorax.top">
           <object className="f_logo" data="https://i.loli.net/2019/12/06/2RvYGoeqhSgQnfA.jpg" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">Soraの小站</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://713.moe">
           <object className="f_logo" data="https://gravatar.loli.net/avatar/a47ae9d9feb6e8f658693c45a25ede37?s=640"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">小太（小太の游乐园）</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://4261.ink">
           <object className="f_logo" data="https://4261.ink/images/avatar.png" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">ruan4261 - 现实带有孔洞，就好像甜甜圈一样</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://yunyoujun.cn">
           <object className="f_logo"
                   data="https://cdn.jsdelivr.net/gh/YunYouJun/yunyoujun.github.io/images/avatar.jpg" type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span" style={{color: "#0078e7"}}>云游君 - 希望能成为一个有趣的人</span>
         </a>
       </div>
       <div className="yunmeng-box">
         <a target="_blank" rel="noopener noreferrer" href="https://blog.yuemoe.cn/">
           <object className="f_logo" data="https://cos-1252620216.cos.ap-chengdu.myqcloud.com/art.jpg"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span yuemeng" style={{color: "#0078e7"}}>月萌 - 没有想念过什么,不曾期待着什么</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://www.nightcitizen.net">
           <div className="f_logo"></div>
           <span className="f_span">forest's Blog</span>
         </a>
       </div>
       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://www.eula.club/friends/">
           <object className="f_logo" data="https://www.eula.club/images/avatar.webp" type="image/webp">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">Eulaの小破站 - 我不知道将去何方，但我已在路上</span>
         </a>
       </div>

       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://www.xcye.xyz/">
           <object className="f_logo" data="https://ooszy.cco.vin/img/blog-public/avatar.jpg" type="image/jpg">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span">qsyyke - I do not follow,i lives is always all you want</span>
         </a>
       </div>

       <div>
         <a target="_blank" rel="noopener noreferrer" href="https://yangger.me/">
           <object className="f_logo"
                   data="https://cdn.yangger.cn/uploads/Rectangle_34_4f98167c51.png?auto=format&fit=max&w=3840"
                   type="image/png">
             <img className="f_logo" src="/sticker/rixiang.png"/>
           </object>
           <span className="f_span"><img
             src="https://cdn.yangger.cn/_next/static/image/public/light-logo.23bdf4c1ff952880a462b8cc64da7d02.svg?auto=format&fit=max&w=384"
             style={{
               height: "20px", paddingTop: "25px"
             }}/>
                    </span>
           <span style={{paddingTop: "5px"}}>
                          YANGGER &nbsp;- NB 就完事了
                    </span>
         </a>
       </div>
     </Random>
    </div>

  )
}

function FriendInfo () {
  return (
    <div  className="markdown-content">
      <blockquote style={{borderLeft: "3px solid #d121ff"}}>
        排名不分先后， 每次刷新随机排序
      </blockquote>
      <blockquote>
        <ul style={{listStyleType: "cambodian", padding: 0}}>
          <div style={{ textAlign: "center" }}>友链申请</div>
          <div style={{ marginTop: ".5rem" }}>申请友链请把你的信息留言即可, 格式</div>
          <div style={{ marginTop: ".5rem" }}>昵称:  月月月子喵</div>
          <div style={{ marginTop: ".5rem" }}>主页:  https://haozi.moe</div>
          <div style={{ marginTop: ".5rem" }}>头像:  https://haozi.moe/css/images/logo_christmas.png</div>
          <div style={{ marginTop: ".5rem" }}>邮箱:  i#haozi.moe (可能会有一些事务通知到您)</div>
          <div style={{ marginTop: ".5rem" }}>RSS:  &nbsp;https://haozi.moe/atom.xml</div>
        </ul>
      </blockquote>
      <blockquote style={{borderLeft: "3px solid #afff34"}}>
        您的申请会在24小时内处理, 请保证可以在您的友链页面检索到本站
      </blockquote>
      <blockquote>
        您可以提交一些自定义化的东西, 比如昵称字体, 背景, 动效等, 尽量满足(如果有不喜欢我添加的特效,可以联系我删除)
      </blockquote>
      <blockquote style={{ borderLeft: "3px solid #ff7e00" }}>
        本人会不定期的访问各位大佬的页面, 如果长期未更新会被标记为 <b>失踪人士</b><br/>
        如果您提供的站点 LOGO 处于一个不可访问的状态, 会被更换为一个 <b>瘫着的日向</b><br/>
      </blockquote>
    </div>
  )
}

export default () => {
  return (
    <Layout>
      <div id="about-banner">
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ color: '#b58900'}}>我的小伙伴</h2>
          <p style={{ color: '#d33682' }}>我的小伙伴</p>
        </div>
      </div>

      <Row justify={"center"}>
        <Col>
          <Row>
            <Col lg={12} md={12} sm={24} xs={24}>
              <FriendList/>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <FriendInfo/>
            </Col>
          </Row>
        </Col>
        <Col>
          <BrowserOnly>
            {
              () => {
                return (
                  <GitalkComponent options={{
                    clientID: "20421b02a1526d225183",
                    clientSecret: "375652780feb5a3ae8c0b8326d52b96517f33c9f",
                    repo: "haozi23333.github.io",
                    owner: "haozi23333",
                    admin: ['haozi23333'],
                    labels: ['gitment'],
                    id: `我的小伙伴`,      // Ensure uniqueness and length less than 50
                    distractionFreeMode: false  // Fac
                  }}/>
                )
              }
            }
          </BrowserOnly>
        </Col>
      </Row>


    </Layout>
  )
}
