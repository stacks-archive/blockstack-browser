import { combineReducers, createStore, Store, compose, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { OnboardingTransform } from './transforms';
import { onboardingReducer } from './onboarding/reducer';
import { OnboardingState } from './onboarding/types';

export interface AppState {
  onboarding: OnboardingState;
}

const reducers = combineReducers<AppState>({
  onboarding: onboardingReducer,
});

const persistConfig = {
  storage,
  key: 'blockstack-redux',
  transforms: [OnboardingTransform],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const _window = window as any;

const middleware = compose(
  applyMiddleware(thunk),
  _window.__REDUX_DEVTOOLS_EXTENSION__ ? _window.__REDUX_DEVTOOLS_EXTENSION__() : (f: unknown) => f
);

export const middlewareComponents = [thunk];

export const store: Store<AppState> = createStore(persistedReducer, undefined, middleware);

export const persistor = persistStore(store);

export default reducers;
