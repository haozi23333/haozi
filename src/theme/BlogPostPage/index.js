/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Seo from '@theme/Seo';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import {ThemeClassNames} from '@docusaurus/theme-common';
import TOC from '@theme/TOC';
import 'gitalk/dist/gitalk.css'
import GitalkComponent from "gitalk/dist/gitalk-component";
import BrowserOnly from '@docusaurus/BrowserOnly';

function BlogPostPage(props) {
  const {content: BlogPostContents, sidebar} = props;
  const {assets, metadata} = BlogPostContents;
  const {
    title,
    description,
    nextItem,
    prevItem,
    date,
    tags,
    authors,
    frontMatter,
  } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    keywords,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;
  const image = assets.image ?? frontMatter.image;
  return (
    <BlogLayout
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogPostPage}
      sidebar={sidebar}
      toc={
        !hideTableOfContents &&
        BlogPostContents.toc &&
        BlogPostContents.toc.length > 0 ? (
          <TOC
            toc={BlogPostContents.toc}
            minHeadingLevel={tocMinHeadingLevel}
            maxHeadingLevel={tocMaxHeadingLevel}
          />
        ) : undefined
      }>
      <Seo // TODO refactor needed: it's a bit annoying but Seo MUST be inside BlogLayout
        // otherwise  default image (set by BlogLayout) would shadow the custom blog post image
        title={title}
        description={description}
        keywords={keywords}
        image={image}>
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={date} />

        {/* TODO double check those article meta array syntaxes, see https://ogp.me/#array */}
        {authors.some((author) => author.url) && (
          <meta
            property="article:author"
            content={authors
              .map((author) => author.url)
              .filter(Boolean)
              .join(',')}
          />
        )}
        {tags.length > 0 && (
          <meta
            property="article:tag"
            content={tags.map((tag) => tag.label).join(',')}
          />
        )}
      </Seo>

      <BlogPostItem
        frontMatter={frontMatter}
        assets={assets}
        metadata={metadata}
        isBlogPostPage>
        <BlogPostContents />
      </BlogPostItem>

      {(nextItem || prevItem) && (
        <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
      )}

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
                            id: `${title}`,      // Ensure uniqueness and length less than 50
                            distractionFreeMode: false  // Fac
                        }}/>
                    )
                }
            }
        </BrowserOnly>
    </BlogLayout>
  );
}

export default BlogPostPage;
