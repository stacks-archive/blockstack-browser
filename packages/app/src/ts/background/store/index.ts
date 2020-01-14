import { combineReducers, createStore, Store, compose, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import settings, { IAppSettings } from './settings/reducer';
import { walletReducer, WalletState } from './wallet';
import { permissionsReducer, PermissionsState } from './permissions';
import { WalletTransform } from './transforms';
import { onboardingReducer } from './onboarding/reducer';
import { OnboardingState } from './onboarding/types';

export interface IAppState {
  settings: IAppSettings;
  wallet: WalletState;
  permissions: PermissionsState;
  onboarding: OnboardingState;
}

const reducers = combineReducers<IAppState>({
  settings,
  wallet: walletReducer,
  permissions: permissionsReducer,
  onboarding: onboardingReducer,
});

const persistConfig = {
  storage,
  key: 'blockstack-redux',
  transforms: [WalletTransform],
  whitelist: ['settings', 'wallet', 'permissions'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const _window = window as any;

const middleware = compose(
  applyMiddleware(thunk),
  _window.__REDUX_DEVTOOLS_EXTENSION__ ? _window.__REDUX_DEVTOOLS_EXTENSION__() : (f: unknown) => f
);

export const middlewareComponents = [thunk];

export const store: Store<IAppState> = createStore(persistedReducer, undefined, middleware);

export const persistor = persistStore(store);

export default reducers;
