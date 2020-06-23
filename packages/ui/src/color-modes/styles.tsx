import { createGlobalStyle } from 'styled-components';
import { generateCssVariables } from './utils';

export const ColorModes = createGlobalStyle`
  :root{
    ${generateCssVariables('light')};
  }

  @media (prefers-color-scheme: dark) {
    :root {
      ${generateCssVariables('dark')};
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      ${generateCssVariables('light')};
    }
  }

  html, body, #__next {
    background: var(--colors-bg);
    border-color: var(--colors-border);
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--colors-text-body);
    font-size: 16px !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: var(--colors-input-placeholder) !important;
  }

  input::-ms-input-placeholder,
  textarea::-ms-input-placeholder {
    color:  var(--colors-input-placeholder) !important;
  }

  input::placeholder,
  textarea::placeholder {
    color:  var(--colors-input-placeholder) !important;
  }
  `;
