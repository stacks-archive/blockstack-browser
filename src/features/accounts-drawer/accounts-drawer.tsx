import React, { useCallback } from 'react';
import { ControlledDrawer } from '@components/drawer/controlled';
import { SwitchAccounts } from '../account-switch-drawer/switch-accounts';
import { CreateAccount } from '@components/drawer/accounts/create-account';
import { AddUsername } from '@components/drawer/accounts/add-username';
import { useDrawers } from '@common/hooks/use-drawers';

import { AccountStep, showAccountsStore, accountDrawerStep } from '@store/ui';
import { useAtomCallback } from 'jotai/utils';

export const AccountsDrawer: React.FC = () => {
  const { accountStep } = useDrawers();

  const close = useAtomCallback(
    useCallback((_get, set) => {
      set(showAccountsStore, false);
      const drawerAnimationTime = 200;
      setTimeout(() => set(accountDrawerStep, AccountStep.Switch), drawerAnimationTime);
    }, [])
  );

  const getTitle = () => {
    switch (accountStep) {
      case AccountStep.Create:
        return 'Create account';
      case AccountStep.Switch:
        return 'Switch account';
      case AccountStep.Username:
        return 'Add a username';
    }
  };

  return (
    <ControlledDrawer title={getTitle()} state={showAccountsStore} close={close}>
      {accountStep === AccountStep.Switch ? <SwitchAccounts close={close} /> : null}
      {accountStep === AccountStep.Create ? <CreateAccount close={close} /> : null}
      {accountStep === AccountStep.Username ? <AddUsername close={close} /> : null}
    </ControlledDrawer>
  );
};
