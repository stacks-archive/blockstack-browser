import React, { useState, useContext } from 'react';
import { LiveProvider, withLive, LiveError, LiveContext, LivePreview } from 'react-live';
import { Box, CodeBlock as BaseCodeBlock } from '@blockstack/ui';
import 'prismjs/components/prism-jsx';
import { CodeEditor } from '@components/code-editor';
import { Caption } from '@components/typography';

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
  <Box
    as={LivePreview}
    fontFamily="body"
    borderRadius="6px"
    p="base"
    border="1px solid var(--colors-border)"
    {...props}
  />
);

export const JsxEditor = ({ liveProviderProps, editorCode, handleCodeChange, language }) => (
  <LiveProvider {...liveProviderProps}>
    <Box mt="base" pl="base">
      <Caption fontFamily="body">Preview</Caption>
    </Box>
    <LiveCodePreview />
    <Box mt="base" tabIndex={-1} position="relative">
      <Box pl="base">
        <Caption fontFamily="body">Editable example</Caption>
      </Box>
      <CodeEditor value={editorCode} onChange={handleCodeChange} language={language} />
    </Box>
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
    border="1px solid var(--colors-border)"
    code={editorCode}
    language={language}
    my="base"
  />
);
