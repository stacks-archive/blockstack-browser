import React from 'react';
import { ScreenHeader as BaseScreenHeader, ScreenHeaderProps } from '@blockstack/connect';
import { selectAppIcon, selectAppName } from '@store/onboarding/selectors';
import { useSelector } from 'react-redux';

export const ScreenHeader = (props: ScreenHeaderProps) => {
  const name = useSelector(selectAppName);
  const icon = useSelector(selectAppIcon);
  const appDetails = {
    name,
    icon,
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return <BaseScreenHeader appDetails={appDetails} {...props} />;
};
