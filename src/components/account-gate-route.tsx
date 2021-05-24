import React, { memo } from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '@components/error-boundary';
import { AccountGate } from '@components/account-gate';
import { ScreenPaths } from '@store/common/types';

interface AccountGateRouteProps {
  path: ScreenPaths;
}

export const AccountGateRoute: React.FC<AccountGateRouteProps> = memo(props => {
  const { path, children } = props;
  return (
    <Route
      path={path}
      element={
        <AccountGate>
          <ErrorBoundary>{children}</ErrorBoundary>
        </AccountGate>
      }
    />
  );
});
