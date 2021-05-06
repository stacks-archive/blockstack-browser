import React, { memo } from 'react';
import { CSSReset } from '@stacks/ui';
import { Global, css } from '@emotion/react';

const SizeStyles = css`
  .mode__extension {
    &,
    body {
      height: 600px !important;
      max-height: 600px !important;
      width: 392px !important;
      overflow: hidden;
    }
  }

  .mode__full-page {
    &,
    body {
      height: 100%;
      max-height: unset;
      width: 100%;

      main.main-content {
        flex-grow: 1;
        justify-content: center;
        max-width: 440px;
        margin: 0 auto;
      }
      .onboarding-text {
        text-align: center;
      }
    }
  }

  .mode__popup {
    &,
    body {
      height: unset !important;
      min-height: 552px !important;
      max-height: 719px !important;
      width: 440px !important;
      overflow: hidden;
    }
  }
  .tippy-box[data-animation='fade'][data-state='hidden'] {
    opacity: 0;
  }
  [data-tippy-root] {
    max-width: calc(100vw - 10px);
  }
  .tippy-box {
    position: relative;
    background-color: #333;
    color: #fff;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
    outline: 0;
    transition-property: transform, visibility, opacity;
  }
  .tippy-box[data-placement^='top'] > .tippy-arrow {
    bottom: 0;
  }
  .tippy-box[data-placement^='top'] > .tippy-arrow:before {
    bottom: -7px;
    left: 0;
    border-width: 8px 8px 0;
    border-top-color: initial;
    transform-origin: center top;
  }
  .tippy-box[data-placement^='bottom'] > .tippy-arrow {
    top: 0;
  }
  .tippy-box[data-placement^='bottom'] > .tippy-arrow:before {
    top: -7px;
    left: 0;
    border-width: 0 8px 8px;
    border-bottom-color: initial;
    transform-origin: center bottom;
  }
  .tippy-box[data-placement^='left'] > .tippy-arrow {
    right: 0;
  }
  .tippy-box[data-placement^='left'] > .tippy-arrow:before {
    border-width: 8px 0 8px 8px;
    border-left-color: initial;
    right: -7px;
    transform-origin: center left;
  }
  .tippy-box[data-placement^='right'] > .tippy-arrow {
    left: 0;
  }
  .tippy-box[data-placement^='right'] > .tippy-arrow:before {
    left: -7px;
    border-width: 8px 8px 8px 0;
    border-right-color: initial;
    transform-origin: center right;
  }
  .tippy-box[data-inertia][data-state='visible'] {
    transition-timing-function: cubic-bezier(0.54, 1.5, 0.38, 1.11);
  }
  .tippy-arrow {
    width: 16px;
    height: 16px;
    color: #333;
  }
  .tippy-arrow:before {
    content: '';
    position: absolute;
    border-color: transparent;
    border-style: solid;
  }
  .tippy-content {
    position: relative;
    padding: 5px 9px;
    z-index: 1;
  }
`;

export const GlobalStyles = memo(() => {
  return (
    <>
      {CSSReset}
      <Global styles={SizeStyles} />
    </>
  );
});
