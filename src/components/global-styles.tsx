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
        max-width: 440px;
        margin: 0 auto;
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
`;

export const GlobalStyles = memo(() => {
  return (
    <>
      {CSSReset}
      <Global styles={SizeStyles} />
    </>
  );
});
