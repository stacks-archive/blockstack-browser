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
        <div className="sidebar-label">Preordered</div>
        <ul className="nav sidebar-list">
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
        <div className="sidebar-label">Registered</div>
        { this.props.registeredIdentities.length ?
        <ul className="nav sidebar-list">
          {this.props.registeredIdentities.map(function(identity) {
            return (
              <li className="nav-item" key={identity.index}>
                <Link to={"/profile/" + identity.id} className="nav-link">
                  {identity.id}
                </Link>
              </li>
            )
          })}
        </ul>
        :
        <ul className="nav sidebar-list">-</ul>
        }
        <ul className="nav sidebar-list">
          <li className="nav-item">
            <Link to="/register" className="nav-link btn btn-sm btn-secondary">
              Register
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/import" className="nav-link btn btn-sm btn-secondary">
              Import
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
