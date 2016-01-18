import { createStore, applyMiddleware, compose } from 'redux'
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'
import RootReducer from '../reducers/index'
import DevTools from '../../components/DevTools'

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
    module.hot.accept('../reducers/index', () =>
      store.replaceReducer(require('../reducers/index'))
    )
  }

  return store
}