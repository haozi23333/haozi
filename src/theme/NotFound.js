/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useEffect} from 'react';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import Toumiao from '../../static/sticker/toumiao.png';
import BrowserOnly from '@docusaurus/BrowserOnly';

function NotFoundProxy() {
    const [time, setTime] = React.useState(10);
    useEffect(() => {
        setInterval(() => {
            setTime(time => {
                setTime(time - 1);
                if (time === 1) {
                    window.location.href = '/';
                }
            })

        }, 1000)
    }, []);
  return (
    <Layout
      title={translate({
        id: 'theme.NotFound.title',
        message: 'Page Not Found',
      })}>
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
           <center>
               <h1 className="hero__title">
                   <Translate
                       id="theme.NotFound.title"
                       description="The title of the 404 page">
                       您访问的资源暂时不存在
                   </Translate>
               </h1>
           </center>
              <center>
                  <img src={Toumiao.src.src} />
              </center>
            <center>偷瞄~</center>
            <center>您访问的资源暂时不存在, 在 <span id="time" style={{ color: 'red' }}>{ time }</span> 秒之后, 将跳转回主页</center>
          </div>
        </div>
      </main>
    </Layout>
  );
}


function NotFound() {
    return (
        <>
            <BrowserOnly>
                {
                    () => <NotFoundProxy />
                }
            </BrowserOnly>
        </>
    )
}
export default NotFound;
