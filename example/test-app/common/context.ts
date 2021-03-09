import { createContext } from 'react';
import { UserSession, AppConfig, UserData } from '@stacks/auth';

export interface AppState {
  userData: UserData | null;
}

export const defaultState = (): AppState => {
  const appConfig = new AppConfig(['store_write'], document.location.href);
  const userSession = new UserSession({ appConfig });

  if (userSession.isUserSignedIn()) {
    return {
      userData: userSession.loadUserData(),
    };
  }
  return { userData: null };
};

export const AppContext = createContext<AppState>(defaultState());
