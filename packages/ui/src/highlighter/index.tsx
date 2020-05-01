import React from 'react';
import Prism from 'prismjs';
import Highlight from 'prism-react-renderer';
import { Box } from '../box';
import { Flex } from '../flex';
import { startPad } from '../utils';
import { useTheme } from '../theme-provider';

import { GrammaticalToken, GetGrammaticalTokenProps, RenderProps, Language } from './types';
import { theme } from './prism-theme';
import './language-definition';

const lineNumberWidth = 60;
const getLineNumber = (n: number, length: number) => startPad(n, length.toString().length + 1);

const Tokens = ({
  tokens,
  getTokenProps,
  showLineNumbers,
  ...rest
}: {
  tokens: GrammaticalToken[];
  getTokenProps: GetGrammaticalTokenProps;
  showLineNumbers?: boolean;
}) => {
  const bsTheme = useTheme();
  const pl = `calc(${showLineNumbers ? lineNumberWidth : '0'}px + ${
    (bsTheme as any).sizes['base'] || '16px'
  })`;

  return (
    <Box pl={pl} pr="base" position="relative" zIndex={2} {...rest}>
      {tokens.map((token, key) => (
        <Box py="2px" display="inline-block" {...getTokenProps({ token, key })} />
      ))}
    </Box>
  );
};
const LineNumber = ({ number, length, ...rest }: { number: number; length: number }) => (
  <Flex
    textAlign="right"
    pr="base"
    pl="base"
    width={lineNumberWidth}
    borderRight="1px solid"
    borderRightColor="inherit"
    color="ink.400"
    flexShrink={0}
    style={{ userSelect: 'none' }}
    position="absolute"
    left={0}
    height="100%"
    align="baseline"
    justify="center"
    zIndex={1}
    {...rest}
  >
    {getLineNumber(number, length)}
  </Flex>
);

const Line = ({
  tokens,
  getTokenProps,
  index,
  length,
  showLineNumbers,
  ...rest
}: {
  tokens: GrammaticalToken[];
  index: number;
  length: number;
  getTokenProps: GetGrammaticalTokenProps;
  showLineNumbers?: boolean;
}) => {
  return (
    <Flex
      height="loose"
      align="baseline"
      borderColor="ink.900"
      _hover={{ bg: ['unset', 'unset', 'ink.900'], borderColor: ['ink.900', 'ink.900', 'ink.600'] }}
      position="relative"
      {...rest}
    >
      {showLineNumbers ? <LineNumber number={index} length={length} /> : null}
      <Tokens showLineNumbers={showLineNumbers} getTokenProps={getTokenProps} tokens={tokens} />
    </Flex>
  );
};

const Lines = ({
  tokens: lines,
  getLineProps,
  getTokenProps,
  className,
  showLineNumbers,
}: { showLineNumbers?: boolean } & RenderProps) => {
  return (
    <Box display="block" className={className}>
      <Box display="block" style={{ fontFamily: 'Fira Code' }}>
        {lines.map((tokens, i) => (
          <Line
            index={i}
            tokens={tokens}
            getTokenProps={getTokenProps}
            length={lines.length + 1}
            showLineNumbers={showLineNumbers}
            {...getLineProps({ line: tokens, key: i })}
          />
        ))}
      </Box>
    </Box>
  );
};

interface HighlighterProps {
  code: string;
  language?: Language;
  showLineNumbers?: boolean;
}

export const Highlighter = ({ code, language = 'clarity', showLineNumbers }: HighlighterProps) => {
  return (
    <Highlight theme={theme} code={code} language={language as any} Prism={Prism as any}>
      {props => <Lines showLineNumbers={showLineNumbers} {...props} />}
    </Highlight>
  );
};
