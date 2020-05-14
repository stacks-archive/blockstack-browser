import React, { useState } from 'react';
import { Highlighter, HighlighterProps } from '../highlighter';
import { Box, BoxProps } from '../box';

export const CodeBlock = ({
  code,
  showLineNumbers,
  style = {},
  language,
  ...rest
}: {
  code: string;
  showLineNumbers?: boolean;
  language?: HighlighterProps['language'];
} & BoxProps) => {
  const [editorCode] = useState(code?.toString().trim());

  return (
    <Box
      overflowX="auto"
      bg="ink"
      borderRadius={[0, 0, '12px']}
      py="base"
      width="100%"
      {...rest}
      style={{
        ...style,
        whiteSpace: 'pre',
        fontFamily: 'Fira Code, Consolata, monospace',
        fontSize: '14px',
      }}
    >
      <Highlighter showLineNumbers={showLineNumbers} code={editorCode} language={language} />
    </Box>
  );
};
