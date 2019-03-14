import { bindActionCreators } from 'redux'
export { connect } from 'react-redux'

import { HawkActions } from '../store/hawk'

export function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, HawkActions)
  return bindActionCreators(actions, dispatch)
}

export function mapStateToProps(state) {
  return {
    username: state.hawk.username
  }
}

// export const makeComponent = (Component) => connect(mapStateToProps, mapDispatchToProps)(Component)
