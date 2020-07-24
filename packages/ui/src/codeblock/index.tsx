import React from 'react';
import { Highlighter, HighlighterProps } from '../highlighter';
import { Box, BoxProps } from '../box';

export type CodeBlockProps = HighlighterProps & BoxProps;

export const CodeBlock = React.forwardRef(
  (
    { code, showLineNumbers, hideLineHover, style = {}, language, Prism, ...rest }: CodeBlockProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <Box
      overflowX="auto"
      bg="ink"
      borderRadius={[0, 0, '12px']}
      py="base"
      width="100%"
      ref={ref}
      style={{
        ...style,
        whiteSpace: 'pre',
        fontFamily: 'Fira Code, Consolata, monospace',
        fontSize: '14px',
      }}
      {...rest}
    >
      <Highlighter
        language={language}
        code={code.toString().trim()}
        showLineNumbers={showLineNumbers}
        hideLineHover={hideLineHover}
        Prism={Prism}
      />
    </Box>
  )
);
