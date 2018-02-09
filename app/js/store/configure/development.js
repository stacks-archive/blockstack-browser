import { createStore, applyMiddleware, compose } from 'redux'
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'

import RootReducer from '../reducers'
import DevTools from '../../components/DevTools'

const finalCreateStore = compose(
  applyMiddleware(thunk),
  DevTools.instrument({ maxAge: 50 }),
  persistState()
)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(RootReducer, initialState)

  if (module.hot) {
    /* eslint global-require: 0 */
    module.hot.accept('../reducers/index', () => store.replaceReducer(require('../reducers')))
  }

  return store
}
