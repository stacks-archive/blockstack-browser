import React from 'react';
import { Stack, StackProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { BalancesAndActivity } from '@components/popup/balances-and-activity';
import { UserAccount } from '@components/home/components/user-area';
import { HomeActions } from '@components/home/components/actions';

const PageTop: React.FC<StackProps> = props => (
  <Stack data-test="home-page" spacing="loose" {...props}>
    <UserAccount />
    <HomeActions />
  </Stack>
);

export const PopupHome: React.FC = () => (
  <PopupContainer header={<Header />} requestType="auth">
    <Stack flexGrow={1} spacing="loose">
      <PageTop />
      <BalancesAndActivity />
    </Stack>
  </PopupContainer>
);
