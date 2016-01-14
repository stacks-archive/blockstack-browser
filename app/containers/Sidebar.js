import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as IdentityActions from '../actions/identities'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.local
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class Sidebar extends Component {
  static propTypes = {
    localIdentities: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const localIdentities = this.props.localIdentities || []

    return (
      <div>
        <div className="sidebar-label">Identities</div>
        { localIdentities.length ?
        <ul className="nav sidebar-list">
          { localIdentities.map(function(identity) {
            return (
              <li className="nav-item" key={identity.index}>
                <Link to={"/profile/local/" + identity.index} className="nav-link">
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

/*
<div className="sidebar-label">Registered</div>
{ registeredIdentities.length ?
<ul className="nav sidebar-list">
  { registeredIdentities.map(function(identity) {
    const index = localIdentities.length + identity.index
    return (
      <li className="nav-item" key={identity.index}>
        <Link to={"/profile/local/" + index} className="nav-link">
          {identity.id}
        </Link>
      </li>
    )
  })}
</ul>
:
<ul className="nav sidebar-list">-</ul>
}
*/