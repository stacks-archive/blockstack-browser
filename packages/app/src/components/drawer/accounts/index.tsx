import React from 'react';
import { ControlledDrawer } from '../controlled';
import { SwitchAccounts } from './switch-accounts';
import { CreateAccount } from './create-account';
import { AddUsername } from './add-username';
import { useDrawers } from '@common/hooks/use-drawers';
import { useRecoilCallback } from 'recoil';
import { AccountStep, showAccountsStore, accountDrawerStep } from '@store/recoil/drawers';

export const AccountsDrawer: React.FC = () => {
  const { accountStep } = useDrawers();

  const close = useRecoilCallback(
    ({ set }) => () => {
      set(showAccountsStore, false);
      const drawerAnimationTime = 200;
      setTimeout(() => set(accountDrawerStep, AccountStep.Switch), drawerAnimationTime);
    },
    []
  );
  return (
    <ControlledDrawer state={showAccountsStore} close={close}>
      {accountStep === AccountStep.Switch ? <SwitchAccounts close={close} /> : null}
      {accountStep === AccountStep.Create ? <CreateAccount close={close} /> : null}
      {accountStep === AccountStep.Username ? <AddUsername close={close} /> : null}
    </ControlledDrawer>
  );
};
