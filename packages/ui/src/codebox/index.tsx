import React, { useState } from 'react';
import { Highlighter } from '../highlighter';
import { Box, BoxProps } from '../box';

export const CodeBlock = ({
  code,
  showLineNumbers,
  style = {},
  ...rest
}: { code: string; showLineNumbers?: boolean } & BoxProps) => {
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
      <Highlighter showLineNumbers={showLineNumbers} code={editorCode} />
    </Box>
  );
};
