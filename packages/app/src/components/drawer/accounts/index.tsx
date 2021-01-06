import React, { useCallback } from 'react';
import { ControlledDrawer } from '../controlled';
import { SwitchAccounts } from './switch-accounts';
import { CreateAccount } from './create-account';
import { AddUsername } from './add-username';
import { useDrawers } from '@common/hooks/use-drawers';
import { AccountStep, showAccountsStore } from '@store/recoil/drawers';

export const AccountsDrawer: React.FC = () => {
  const { accountStep, setAccountStep, setShowAccounts } = useDrawers();

  const close = useCallback(() => {
    setAccountStep(AccountStep.Switch);
    setShowAccounts(false);
  }, [setAccountStep, setShowAccounts]);
  return (
    <ControlledDrawer state={showAccountsStore} close={close}>
      {accountStep === AccountStep.Switch ? <SwitchAccounts close={close} /> : null}
      {accountStep === AccountStep.Create ? <CreateAccount close={close} /> : null}
      {accountStep === AccountStep.Username ? <AddUsername close={close} /> : null}
    </ControlledDrawer>
  );
};
