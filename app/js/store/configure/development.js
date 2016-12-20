import { createStore, applyMiddleware, compose } from 'redux'
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'

import RootReducer from '../reducers/index'
import DevTools from '../../components/DevTools'

const finalCreateStore = compose(
  applyMiddleware(thunk),
  DevTools.instrument(),
  persistState()
)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(RootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducers/index', () =>
      store.replaceReducer(require('../reducers/index'))
    )
  }

  return store
}