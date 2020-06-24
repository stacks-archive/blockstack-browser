import React, { useContext } from 'react';
import { LiveProvider, LiveContext, LivePreview } from 'react-live';
import { Box, CodeBlock as BaseCodeBlock, space, color } from '@blockstack/ui';
import 'prismjs/components/prism-jsx';
import { CodeEditor } from '@components/code-editor';
import { Caption } from '@components/typography';
import 'prismjs/components/prism-tsx';
import { border } from '@common/utils';

const Error = (props: any) => {
  const { error } = useContext(LiveContext);

  return error ? <BaseCodeBlock code={error} /> : null;
};

export const liveEditorStyle = {
  fontSize: 14,
  marginBottom: 24,
  marginTop: 24,
  overflowX: 'auto',
  fontFamily: 'Menlo,monospace',
  borderRadius: 10,
};

export const liveErrorStyle = {
  fontFamily: 'Fira Mono, monospace',
  fontSize: 14,
  padding: '1em',
  overflowX: 'auto',
  color: 'white',
  marginTop: '16px',
  border: '1px solid var(--colors-border)',
  backgroundColor: 'var(--colors-bg-light)',
};

export const LiveCodePreview = (props: any) => (
  <Box fontFamily="body">
    <Box
      as={LivePreview}
      boxShadow="mid"
      border={border()}
      borderRadius="6px"
      p={space('base')}
      mb={space('base')}
      {...props}
    />
  </Box>
);

export const JsxEditor = ({
  liveProviderProps,
  editorCode,
  handleCodeChange,
  language,
  ...rest
}) => (
  <LiveProvider {...liveProviderProps}>
    <Box mb={space('tight')} mt={space('base')}>
      <Caption fontWeight={500} pl={space('tight')} fontFamily="body">
        Preview
      </Caption>
    </Box>
    <LiveCodePreview />

    <Box mb={space('tight')}>
      <Caption fontWeight={500} pl={space('tight')} fontFamily="body">
        Editable example
      </Caption>
    </Box>
    <CodeEditor value={editorCode} onChange={handleCodeChange} language={language} />
    <Error />
  </LiveProvider>
);

export const Preview = ({ liveProviderProps }) => (
  <Box>
    <LiveProvider {...liveProviderProps}>
      <LiveCodePreview />
    </LiveProvider>
  </Box>
);

export const SimpleCodeBlock = ({ editorCode, language }) => (
  <BaseCodeBlock
    borderTop={border()}
    borderBottom={border()}
    borderLeft={['none', border(), border()]}
    borderRight={['none', border(), border()]}
    code={editorCode}
    language={language}
    my="base"
  />
);
