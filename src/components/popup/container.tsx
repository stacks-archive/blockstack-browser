import React, { memo } from 'react';
import { Flex, color } from '@stacks/ui';
import { SettingsPopover } from './settings-popover';
import { useRecoilValue } from 'recoil';
import { hasRehydratedVaultStore } from '@store/wallet';

interface PopupHomeProps {
  header?: any;
}

export const PopupContainer: React.FC<PopupHomeProps> = memo(({ children, header }) => {
  const hasRehydratedVault = useRecoilValue(hasRehydratedVaultStore);

  if (!hasRehydratedVault) {
    console.error('No hasRehydratedVault, rendered null');
  }
  return (
    <Flex
      flexDirection="column"
      flexGrow={1}
      width="100%"
      background={color('bg')}
      data-test="container-outer"
      minHeight="100vh"
      maxHeight="100vh"
      position="relative"
      overflow="auto"
    >
      {header && header}
      <SettingsPopover />
      <Flex
        flexDirection="column"
        flexGrow={1}
        className="main-content"
        as="main"
        position="relative"
        width="100%"
        px="loose"
        pb="loose"
      >
        {/*TODO: this seems like a bug, I think it could cause a blank screen some time*/}
        {hasRehydratedVault ? children : null}
      </Flex>
    </Flex>
  );
});
