import React, { memo } from 'react';
import { CSSReset } from '@stacks/ui';
import { Global, css } from '@emotion/react';

const SizeStyles = css`
  body {
    display: flex;
    width: 100%;
  }
  #app-root {
    flex-grow: 1;
    display: flex;
    min-height: 100vh;
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
