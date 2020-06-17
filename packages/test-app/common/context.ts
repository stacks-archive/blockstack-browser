import { createContext } from 'react';
import { UserData } from 'blockstack/lib/auth/authApp';
import { UserSession, AppConfig } from 'blockstack';

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
