import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import RootReducer from '../reducers'
import persistState from 'redux-localstorage'

const finalCreateStore = compose(
  applyMiddleware(thunk),
  persistState()
)(createStore)

export default function configureStore(initialState) {
  return finalCreateStore(RootReducer, initialState)
}