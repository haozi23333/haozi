import React from "react";

export default function License() {
  return <>
    <blockquote style={{
      border:'1px dashed #e0e0e0',
      padding:'.7rem',
      margin:'30px 0 5px',
      borderRadius:'5px'
    }}>
      <div className="post-about">
        <p>除另有声明外，本博客文章均采用 &nbsp;&nbsp;
          <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/cn/">知识共享(Creative Commons) 署名-非商业性使用-相同方式共享 3.0 中国大陆许可协议 &nbsp;&nbsp;
          </a> 进行许可。
        </p>
      </div>
    </blockquote>
  </>
}
