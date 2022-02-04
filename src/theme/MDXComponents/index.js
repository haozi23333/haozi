/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {isValidElement} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import Details from '@theme/Details';
import './styles.css';
import {Alert, Image} from "antd"; // MDX elements are wrapped through the MDX pragma
// In some cases (notably usage with Head/Helmet) we need to unwrap those elements.
import RepoCards from 'react-gh-repo-cards'

function unwrapMDXElement(element) {
  if (element?.props?.mdxType && element?.props?.originalType) {
    const {mdxType, originalType, ...newProps} = element.props;
    return React.createElement(element.props.originalType, newProps);
  }

  return element;
}

const MDXComponents = {
  head: (props) => {
    const unwrappedChildren = React.Children.map(props.children, (child) =>
      unwrapMDXElement(child),
    );
    return <Head {...props}>{unwrappedChildren}</Head>;
  },
  code: (props) => {
    const shouldBeInline = React.Children.toArray(props.children).every(
      (el) => typeof el === 'string' && !el.includes('\n'),
    );
    return shouldBeInline ? <code {...props} /> : <CodeBlock {...props} />;
  },
  a: (props) => <Link {...props} />,
  pre: (props) => (
    <CodeBlock // If this pre is created by a ``` fenced codeblock, unwrap the children
      {...(isValidElement(props.children) &&
      props.children.props.originalType === 'code'
        ? props.children?.props
        : {...props})}
    />
  ),
  details: (props) => {
    const items = React.Children.toArray(props.children); // Split summary item from the rest to pass it as a separate prop to the Details theme component

    const summary = items.find((item) => item?.props?.mdxType === 'summary');
    const children = <>{items.filter((item) => item !== summary)}</>;
    return (
      <Details {...props} summary={summary}>
        {children}
      </Details>
    );
  },
  h1: (props) => <Heading as="h1" {...props} />,
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  h4: (props) => <Heading as="h4" {...props} />,
  h5: (props) => <Heading as="h5" {...props} />,
  h6: (props) => <Heading as="h6" {...props} />,
  img: (props) => <center><Image {...props} /></center>,
  RepoCards: (props) => <RepoCards {...props}/>,
  Alert: (props) => <Alert {...props}/>,
};
export default MDXComponents;
