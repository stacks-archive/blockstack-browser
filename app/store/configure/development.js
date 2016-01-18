import { createStore, applyMiddleware, compose } from 'redux'
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'
import RootReducer from '../reducers'
import DevTools from '../../containers/DevTools'

const config = {
  key: 'redux',
  slicer: (paths) => {
    return (state) => {
      return state
    }
  }
}

const paths = [
  'actionsById', 'committedState', 'computedStates', 'currentStateIndex',
  'monitorState', 'nextActionId', 'skippedActionIds', 'stagedActionIds'
]

const finalCreateStore = compose(
  applyMiddleware(thunk),
  DevTools.instrument()
)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(RootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    )
  }

  return store
}