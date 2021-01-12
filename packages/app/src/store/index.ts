import { combineReducers, createStore, Store, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { onboardingReducer } from './onboarding/reducer';
import { OnboardingState } from './onboarding/types';

export interface AppState {
  onboarding: OnboardingState;
}

const reducers = combineReducers<AppState>({
  onboarding: onboardingReducer,
});

const _window = window as any;

const middleware = compose(
  applyMiddleware(thunk),
  _window.__REDUX_DEVTOOLS_EXTENSION__ ? _window.__REDUX_DEVTOOLS_EXTENSION__() : (f: unknown) => f
);

export const middlewareComponents = [thunk];

export const store: Store<AppState> = createStore(reducers, undefined, middleware);

export default reducers;
