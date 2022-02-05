/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import PaginatorNavLink from '@theme/PaginatorNavLink';

function BlogListPaginator(props) {
  const {metadata} = props;
  const {previousPage, nextPage} = metadata;
  console.log({
      previousPage, nextPage
  })
  return (
    <nav
      className="pagination-nav"
      aria-label={translate({
        id: 'theme.blog.paginator.navAriaLabel',
        message: 'Blog list page navigation',
        description: 'The ARIA label for the blog pagination',
      })}>
      <div className="pagination-nav__item">
        {previousPage && (
          <PaginatorNavLink
            permalink={previousPage}
            title={
              <Translate
                id="theme.blog.paginator.newerEntries"
                description="The label used to navigate to the newer blog posts page (previous page)">
                Newer Entries
              </Translate>
            }
          />
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {nextPage && (
          <PaginatorNavLink
            permalink={nextPage.replace(/\/\//g, '/')}
            title={
              <Translate
                id="theme.blog.paginator.olderEntries"
                description="The label used to navigate to the older blog posts page (next page)">
                Older Entries
              </Translate>
            }
          />
        )}
      </div>
    </nav>
  );
}

export default BlogListPaginator;