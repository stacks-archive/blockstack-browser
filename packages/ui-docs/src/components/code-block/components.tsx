import React, { useContext } from 'react';
import { LiveProvider, LiveContext, LivePreview } from 'react-live';
import {
  Flex,
  Button,
  Box,
  CodeBlock as BaseCodeBlock,
  space,
  useClipboard,
  color,
  BoxProps,
} from '@blockstack/ui';
import 'prismjs/components/prism-jsx';
import { CodeEditor } from '@components/code-editor';
import { Text } from '@components/typography';
import 'prismjs/components/prism-tsx';
import { border } from '@common/utils';

const Error = () => {
  const { error } = useContext(LiveContext);

  return error ? <BaseCodeBlock mt={space('base')} code={error} /> : null;
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

const Label = (props: BoxProps) => (
  <Text fontWeight={500} fontFamily="body" fontSize="12px" {...props} />
);

export const JsxEditor = ({ liveProviderProps, editorCode, handleCodeChange, language }) => {
  const { hasCopied, onCopy } = useClipboard(editorCode);
  return (
    <LiveProvider {...liveProviderProps}>
      <Box mb={space('extra-tight')} mt={space('base')}>
        <Label>Preview</Label>
      </Box>
      <LiveCodePreview />

      <Flex justify="space-between" fontFamily="'Inter'" align="flex-end" mb={space('tight')}>
        <Label>Editable example</Label>
        <Button onClick={onCopy} size="sm" mode="secondary">
          {hasCopied ? 'Copied!' : 'Copy example code'}
        </Button>
      </Flex>
      <CodeEditor value={editorCode} onChange={handleCodeChange} language={language} />
      <Error />
    </LiveProvider>
  );
};

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
