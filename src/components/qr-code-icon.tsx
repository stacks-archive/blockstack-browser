import React from 'react';
import type { BoxProps } from '@stacks/ui';
import { Box } from '@stacks/ui';

export function QrCodeIcon({ strokeWidth = 1.5, ...props }: BoxProps) {
  return (
    <Box viewBox="0 0 14 14" fill="none" strokeWidth={strokeWidth} {...props} as="svg">
      <path
        d="M5.66667 1L1 1L1 5.66667H5.66667V1Z"
        stroke="currentColor"
        strokeWidth={strokeWidth as any}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 1L8.33337 1V5.66667H13V1Z"
        stroke="currentColor"
        strokeWidth={strokeWidth as any}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33337 8.33301H8.33337V9.33301H9.33337V8.33301Z"
        stroke="currentColor"
        strokeWidth={strokeWidth as any}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33337 12H8.33337V13H9.33337V12Z"
        stroke="currentColor"
        strokeWidth={strokeWidth as any}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8.33301H12V9.33301H13V8.33301Z"
        stroke="currentColor"
        strokeWidth={strokeWidth as any}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 12H12V13H13V12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.66667 8.33301H1L1 12.9997H5.66667V8.33301Z"
        stroke="currentColor"
        strokeWidth={strokeWidth as any}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Box>
  );
}
