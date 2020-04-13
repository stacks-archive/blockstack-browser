import { PrismTheme } from 'prism-react-renderer';

export const theme: PrismTheme = {
  plain: {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  styles: [
    {
      types: ['prolog'],
      style: {
        color: 'rgb(0, 0, 128)',
      },
    },
    {
      types: ['comment', 'punctuation'],
      style: {
        color: 'rgb(106, 153, 85)',
      },
    },
    {
      types: ['builtin', 'tag', 'changed', 'function', 'keyword'],
      style: {
        color: 'rgb(86, 156, 214)',
      },
    },
    {
      types: ['number', 'variable', 'inserted'],
      style: {
        color: '#A58FFF',
      },
    },
    {
      types: ['operator'],
      style: {
        color: 'rgb(212, 212, 212)',
      },
    },
    {
      types: ['constant'],
      style: {
        color: 'rgb(100, 102, 149)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: 'rgb(156, 220, 254)',
      },
    },
    {
      types: ['car'],
      style: {
        color: 'rgb(156, 220, 254)',
      },
    },
    {
      types: ['deleted', 'string'],
      style: {
        color: '#FF7B48',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: 'rgb(78, 201, 176)',
      },
    },
    {
      types: ['char'],
      style: {
        color: '#FF7B48',
      },
    },
  ],
};
