import * as React from 'react';

export interface GrammaticalToken {
  types: string[];
  content: string;
  empty?: boolean;
}

export interface StyleObj {
  [key: string]: string | number | null;
}

export interface GrammaticalTokenOutputProps {
  key?: React.Key;
  style?: StyleObj;
  className: string;
  children: string;
  [otherProp: string]: any;
}

export interface GrammaticalTokenInputProps {
  key?: React.Key;
  style?: StyleObj;
  className?: string;
  token: GrammaticalToken;
  [otherProp: string]: any;
}

export interface LineInputProps {
  key?: React.Key;
  style?: StyleObj;
  className?: string;
  line: GrammaticalToken[];
  [otherProp: string]: any;
}

export interface LineOutputProps {
  key?: React.Key;
  style?: StyleObj;
  className: string;
  [otherProps: string]: any;
}

export interface RenderProps {
  tokens: GrammaticalToken[][];
  className: string;
  style: StyleObj;
  getLineProps: (input: LineInputProps) => LineOutputProps;
  getTokenProps: (input: GrammaticalTokenInputProps) => GrammaticalTokenOutputProps;
}

export type GetGrammaticalTokenProps = (
  input: GrammaticalTokenInputProps
) => GrammaticalTokenOutputProps;

export type Language =
  | 'markup'
  | 'bash'
  | 'clarity'
  | 'clike'
  | 'c'
  | 'cpp'
  | 'css'
  | 'javascript'
  | 'jsx'
  | 'coffeescript'
  | 'actionscript'
  | 'css-extr'
  | 'diff'
  | 'git'
  | 'go'
  | 'graphql'
  | 'handlebars'
  | 'json'
  | 'less'
  | 'lisp'
  | 'makefile'
  | 'markdown'
  | 'objectivec'
  | 'ocaml'
  | 'python'
  | 'reason'
  | 'sass'
  | 'scss'
  | 'sql'
  | 'stylus'
  | 'tsx'
  | 'typescript'
  | 'wasm'
  | 'yaml';
