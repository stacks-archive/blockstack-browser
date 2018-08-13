import { createStore, applyMiddleware, compose } from 'redux'
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'
import { initialState as AuthInitialState } from '../auth/store/auth'
import RootReducer from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const finalCreateStore = composeEnhancers(
  applyMiddleware(thunk),
  persistState(null, {
    // eslint-disable-next-line
    slicer: paths => state => ({ ...state, auth: AuthInitialState })
  })
)(createStore)

export default function configureStore(initialState) {
  return finalCreateStore(RootReducer, initialState)
}
