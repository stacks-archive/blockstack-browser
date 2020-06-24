import React, { forwardRef, Ref } from 'react';
import { LinkProps } from '@components/typography';
import { useColorMode } from '@blockstack/ui';
import { DarkModeIcon } from '@components/icons/dark-mode';
import { LightModeIcon } from '@components/icons/light-mode';
import { IconButton } from '@components/icon-button';

export const ColorModeButton = forwardRef((props: LinkProps, ref: Ref<HTMLDivElement>) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton onClick={toggleColorMode} title="Toggle color mode" {...props} ref={ref}>
      {colorMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
});
