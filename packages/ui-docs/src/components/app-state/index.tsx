import React from 'react';
import { AppStateContext, initialState } from '@components/app-state/context';

const AppStateProvider = ({ version, ...props }: any) => {
  const [state, setState] = React.useState(initialState);

  const handleSetVersion = (version: string) => {
    setState(s => ({
      ...s,
      version,
    }));
  };

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        setState,
        version,
        handleSetVersion,
      }}
      {...props}
    />
  );
};

export { AppStateProvider, AppStateContext };
