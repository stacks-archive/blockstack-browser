import { createStore, applyMiddleware, compose } from 'redux'
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'

import RootReducer from '../reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const finalCreateStore = composeEnhancers(
  applyMiddleware(thunk),
  persistState(null, {
    slicer: paths => state => ({ ...state, auth: {} })
  })
)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(RootReducer, initialState)

  if (module.hot) {
    /* eslint global-require: 0 */
    module.hot.accept('../reducers/index', () =>
      store.replaceReducer(require('../reducers'))
    )
  }

  return store
}
