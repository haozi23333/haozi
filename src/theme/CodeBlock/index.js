/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {isValidElement, useEffect, useState} from 'react';
import clsx from 'clsx';
import Highlight, {defaultProps} from 'prism-react-renderer';
import copy from 'copy-text-to-clipboard';
import Translate, {translate} from '@docusaurus/Translate';
import BrowserOnly from '@docusaurus/BrowserOnly';

import {
  useThemeConfig,
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  ThemeClassNames,
  usePrismTheme,
    useColorMode
} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import BrowserWindow from "@site/src/components/BrowserWindow";


export default function CodeBlock({
  children,
  className: blockClassName = '',
  metastring,
  title,
  language: languageProp,
}) {
    const [theme, setTheme] = useState('dark');
    const {prism} = useThemeConfig();
    const {isDarkTheme} = useColorMode();
  const [showCopied, setShowCopied] = useState(false);
  const [mounted, setMounted] = useState(false); // The Prism theme on SSR is always the default theme but the site theme
  // can be in a different mode. React hydration doesn't update DOM styles
  // that come from SSR. Hence force a re-render after mounting to apply the
  // current relevant styles. There will be a flash seen of the original
  // styles seen using this current approach but that's probably ok. Fixing
  // the flash will require changing the theming approach and is not worth it
  // at this point.

  useEffect(() => {
    setMounted(true);
  }, []); // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const codeBlockTitle = parseCodeBlockTitle(metastring) || title;
  //TODO 兼容代码标题
  const prismTheme = usePrismTheme(); // <pre> tags in markdown map to CodeBlocks and they may contain JSX children.
  // When the children is not a simple qwd, we just return a styled block without actually highlighting.

    useEffect(() => {
        if (prismTheme.plain.backgroundColor === "#f6f8fa") {
            setTheme('solarized_light')
        } else {
            setTheme('solarized_dark')
        }
    }, [prismTheme])

  if (React.Children.toArray(children).some((el) => isValidElement(el))) {
    return (
      <BrowserWindow>
        <Highlight
            {...defaultProps}
            key={String(mounted)}
            theme={prismTheme}
            code=""
            language={'text'}>
          {({className, style}) => (
              <pre
                  /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                  tabIndex={0}
                  className={clsx(
                      className,
                      styles.codeBlockStandalone,
                      'thin-scrollbar',
                      styles.codeBlockContainer,
                      blockClassName,
                      ThemeClassNames.common.codeBlock,
                  )}
                  style={style}>
            <code className={styles.codeBlockLines}>{children}</code>
          </pre>
          )}
        </Highlight>
      </BrowserWindow>
    );
  } // The children is now guaranteed to be one/more plain strings

  const content = Array.isArray(children) ? children.join('') : children;
  const language =
    languageProp ?? parseLanguage(blockClassName) ?? prism.defaultLanguage;
  const {highlightLines, code} = parseLines(content, metastring, language);

  const handleCopyCode = () => {
    copy(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
      <div className={styles.codeBlockContent}>
          {
              <BrowserOnly
                  fallback={<>加载中.....</>}
              >
                  {
                      () => {
                          // import AceEditor from "react-ace"
                          const AceEditor = require('react-ace').default;
                          require("ace-builds/src-noconflict/mode-sh");
                          require("ace-builds/src-noconflict/mode-c_cpp");
                          require("ace-builds/src-noconflict/mode-mysql");
                          require("ace-builds/src-noconflict/mode-java");
                          require("ace-builds/src-noconflict/mode-javascript");
                          require("ace-builds/src-noconflict/mode-typescript");
                          require("ace-builds/src-noconflict/mode-powershell");
                          require("ace-builds/src-noconflict/mode-text");
                          require("ace-builds/src-noconflict/mode-plain_text");
                          require("ace-builds/src-noconflict/mode-rust");
                          require("ace-builds/src-noconflict/mode-python");
                          require("ace-builds/src-noconflict/mode-json");
                          require("ace-builds/src-noconflict/mode-protobuf");
                          require("ace-builds/src-noconflict/mode-golang");
                          require("ace-builds/src-noconflict/mode-elixir");
                          require("ace-builds/src-noconflict/mode-html");
                          require("ace-builds/src-noconflict/mode-yaml");
                          require("ace-builds/src-noconflict/mode-lua");
                          require("ace-builds/src-noconflict/mode-groovy");
                          require("ace-builds/src-noconflict/mode-sql");
                          require("ace-builds/src-noconflict/mode-markdown");
                          require("ace-builds/src-noconflict/theme-solarized_light");
                          require("ace-builds/src-noconflict/theme-solarized_dark");


                          return (
                              <AceEditor
                                  mode={language ?? 'text'}
                                  theme={isDarkTheme ? 'solarized_dark' : 'solarized_light'}
                                  value={code}
                                  onChange={() => {}}
                                  name="UNIQUE_ID_OF_DIV"
                                  style={{
                                      width: '100%',
                                      marginBottom: '.5rem'
                                  }}
                                  editorProps={{$blockScrolling: true}}
                                  setOptions={{
                                      showLineNumbers: true,
                                      tabSize: 2,
                                      wrap: true,
                                      fontSize: 16,
                                      maxLines: 50,
                                      readOnly: true,
                                  }}
                              />
                          )
                      }
                  }
              </BrowserOnly>
          }
        <button
            type="button"
            aria-label={translate({
              id: 'theme.CodeBlock.copyButtonAriaLabel',
              message: 'Copy code to clipboard',
              description: 'The ARIA label for copy code blocks button',
            })}
            className={clsx(styles.copyButton, 'clean-btn')}
            onClick={handleCopyCode}>
          {showCopied ? (
              <Translate
                  id="theme.CodeBlock.copied"
                  description="The copied button label on code blocks">
                Copied
              </Translate>
          ) : (
              <Translate
                  id="theme.CodeBlock.copy"
                  description="The copy button label on code blocks">
                Copy
              </Translate>
          )}
        </button>
      </div>
  )
}
