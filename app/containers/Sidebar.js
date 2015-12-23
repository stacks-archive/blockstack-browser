import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as IdentityActions from '../actions/identities'

function mapStateToProps(state) {
  return {
    preorderedIdentities: state.identities.preordered,
    registeredIdentities: state.identities.registered
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class Sidebar extends Component {
  static propTypes = {
    preorderedIdentities: PropTypes.array.isRequired,
    registeredIdentities: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <ul className="nav">
          {this.props.preorderedIdentities.map(function(identity) {
            return (
              <li className="nav-item" key={identity.index}>
                <Link to={"/profile/" + identity.id} className="nav-link">
                  {identity.id}
                </Link>
              </li>
            )
          })}
        </ul>
        <hr />
        <ul className="nav">
          <li className="nav-item">
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/import" className="nav-link">
              Import
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
