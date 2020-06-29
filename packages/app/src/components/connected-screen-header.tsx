import React from 'react';
import { ScreenHeader as BaseScreenHeader, ScreenHeaderProps } from '@blockstack/connect';
import { selectFullAppIcon, selectAppName } from '@store/onboarding/selectors';
import { useSelector } from 'react-redux';

export const ScreenHeader = (props: ScreenHeaderProps) => {
  const name = useSelector(selectAppName);
  const icon = useSelector(selectFullAppIcon);
  const appDetails = name && icon ? { name, icon } : undefined;
  return <BaseScreenHeader appDetails={appDetails} hideIcon={props.hideIcon || !icon} {...props} />;
};
