import { combineReducers, createStore, Store, compose, applyMiddleware } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import counter, { ICounter } from './counter/reducer'
import settings, { IAppSettings } from './settings/reducer'
import { walletReducer, WalletState } from './wallet'
import { permissionsReducer, PermissionsState } from './permissions'
import { WalletTransform } from './transforms'

import 'redux'
// Enhance the Action interface with the option of a payload.
// While still importing the Action interface from redux.
declare module 'redux' {
  export interface Action<T = any, P = any> {
    type: T
    payload?: P
  }
}

export interface IAppState {
  counter: ICounter
  settings: IAppSettings
  wallet: WalletState
  permissions: PermissionsState
}

const reducers = combineReducers<IAppState>({
  counter,
  settings,
  wallet: walletReducer,
  permissions: permissionsReducer
})

const persistConfig = {
  storage,
  key: 'blockstack-redux',
  transforms: [WalletTransform]
}

const persistedReducer = persistReducer(persistConfig, reducers)

const _window = window as any

const middleware = compose(
  applyMiddleware(thunk),
  _window.__REDUX_DEVTOOLS_EXTENSION__ ? _window.__REDUX_DEVTOOLS_EXTENSION__() : (f: unknown) => f
)

export const middlewareComponents = [thunk]

export const store: Store<IAppState> = createStore(persistedReducer, undefined, middleware)

export const persistor = persistStore(store)

export default reducers
