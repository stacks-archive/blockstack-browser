import React from 'react';

import Editor from 'react-simple-code-editor';
import { createGlobalStyle } from 'styled-components';
import { Box, BoxProps, Highlighter } from '@blockstack/ui';
// TODO: change when new version is published
import { Language } from '@blockstack/ui/dist/ui/src/highlighter/types';

const TextAreaOverrides = createGlobalStyle`
.code-editor{
  input,
  textarea,
  [contenteditable] {
    caret-color: white;
  }
  & * {
      font-size: 14px !important;
  }
  textarea{
    width: 100% !important;
    padding-left: 16px !important;
    font-size: 14px !important;
    padding-top: 1px !important;
    font-family: 'Fira Code',monospace !important;
    line-height: 24px !important;
    outline: transparent;
  }
  & > div{
    overflow: initial !important;
  }
  textarea, pre {
    white-space: pre !important;
    overflow-wrap: unset !important;
  }
}
`;

interface CodeEditorProps extends Partial<Omit<BoxProps, 'onChange'>> {
  value: string;
  disabled?: boolean;
  language?: Language;
  onChange?: (code: string) => void;
  name?: string;
  id?: string;
}

export const CodeEditor = React.memo((props: CodeEditorProps) => {
  const { style, value, onChange, language, id, disabled, maxHeight, ...rest } = props;
  const [code, setState] = React.useState(value);

  const updateContent = (c: string) => {
    if (c === code) {
      return;
    }
    setState(s => {
      if (props.onChange) {
        props.onChange(c);
      }
      return c;
    });
  };

  React.useEffect(() => {
    if (value !== code) {
      updateContent(value);
    }
  }, [value]);

  return (
    <>
      <TextAreaOverrides />
      <Box
        className="code-editor"
        bg="ink"
        borderRadius={['unset', 'unset', '12px', '12px']}
        py="base-tight"
        border="1px solid var(--colors-border)"
        overflowX="auto"
        minWidth="100%"
        maxHeight={maxHeight}
      >
        <Editor
          textareaId={id}
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          language={language}
          onValueChange={updateContent}
          highlight={c => <Highlighter code={c} language={language} />}
          style={{
            ...style,
            overflowWrap: 'unset',
            whiteSpace: 'pre !important' as any,
          }}
          value={code}
          {...rest}
        />
      </Box>
    </>
  );
});
