import React from 'react'
import styled from 'styled-components'
import { Flex, theme } from '../../src'

export const Container = styled(Flex)`
  p, a {
    pre {
      display: inline-block !important;
      margin: 0;
    }
  }
  --lightgray: ${theme.colors.blue.light};
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  li {
    color: ${theme.colors.blue.neutral};
  }

  blockquote {
    font-size: 16px;
    padding-left: 20px;
    font-style: italic;
    position: relative;
    color: ${theme.colors.blue.neutral};
    font-weight: 600;
    p {
      font-weight: 600;

      color: ${theme.colors.blue.neutral};
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      opacity: 0.25;
      padding-left: 20px;
      border-left: 5px solid ${theme.colors.blue};
    }
  }
  * {
    box-sizing: border-box;
  }
  code[class*='language-'],
  pre[class*='language-'] {
    color: #a9b7c6;
    font-family: Consolas, Monaco, 'Andale Mono', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  pre[class*='language-']::-moz-selection,
  pre[class*='language-'] ::-moz-selection,
  code[class*='language-']::-moz-selection,
  code[class*='language-'] ::-moz-selection {
    color: inherit;
    background: rgba(33, 66, 131, 0.85);
  }

  pre[class*='language-']::selection,
  pre[class*='language-'] ::selection,
  code[class*='language-']::selection,
  code[class*='language-'] ::selection {
    color: inherit;
    background: rgba(33, 66, 131, 0.85);
  }

  /* Code blocks */
  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
  }

  :not(pre) > code[class*='language-'],
  pre[class*='language-'] {
    background: #2b2b2b;
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    padding: 0.1em;
    border-radius: 0.3em;
  }

  .token.comment,
  .token.prolog,
  .token.cdata {
    color: #808080;
  }

  .token.delimiter,
  .token.boolean,
  .token.keyword,
  .token.selector,
  .token.important,
  .token.atrule {
    color: #cc7832;
  }

  .token.operator,
  .token.punctuation,
  .token.attr-name {
    color: #a9b7c6;
  }

  .token.tag,
  .token.tag .punctuation,
  .token.doctype,
  .token.builtin {
    color: #e8bf6a;
  }

  .token.entity,
  .token.number,
  .token.symbol {
    color: #6897bb;
  }

  .token.property,
  .token.constant,
  .token.variable {
    color: #9876aa;
  }

  .token.string,
  .token.char {
    color: #6a8759;
  }

  .token.attr-value,
  .token.attr-value .punctuation {
    color: #a5c261;
  }
  .token.attr-value .punctuation:first-child {
    color: #a9b7c6;
  }

  .token.url {
    color: #287bde;
    text-decoration: underline;
  }

  .token.function {
    color: #ffc66d;
  }

  .token.regex {
    background: #364135;
  }

  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.inserted {
    background: #294436;
  }

  .token.deleted {
    background: #484a4a;
  }

  /*code.language-css .token.punctuation {
	color: #cc7832;
}*/

  code.language-css .token.property,
  code.language-css .token.property + .token.punctuation {
    color: #a9b7c6;
  }

  code.language-css .token.id {
    color: #ffc66d;
  }

  code.language-css .token.selector > .token.class,
  code.language-css .token.selector > .token.attribute,
  code.language-css .token.selector > .token.pseudo-class,
  code.language-css .token.selector > .token.pseudo-element {
    color: #ffc66d;
  }
  .prism-code {
    padding: 20px;
    font-family: 'Fira Mono', monospace !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 15px !important;
    * {
      font-family: 'Fira Mono', monospace !important;
      font-size: 15px !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
`
