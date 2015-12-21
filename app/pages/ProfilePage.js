import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import AccountListItem from '../components/AccountListItem'
import { getName, getVerifiedAccounts, getAvatarUrl } from '../utils/profile-utils.js'
import * as ProfileActions from '../actions/identities'

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch)
}

class ProfilePage extends Component {
  static propTypes = {
    updateCurrentIdentity: PropTypes.func.isRequired,
    fetchCurrentIdentity: PropTypes.func.isRequired,
    currentIdentity: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      currentIdentity: {
        profile: {},
        verifications: []
      }
    }
  }

  componentDidReceiveProps(id) {
    this.props.fetchCurrentIdentity(id)
  }

  componentDidMount() {
    this.componentDidReceiveProps(this.props.routeParams.id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams.id !== this.props.routeParams.id) {
      this.componentDidReceiveProps(nextProps.routeParams.id)
    }
    this.setState({
      currentIdentity: nextProps.currentIdentity
    })
  }

  render() {
    var blockchainId = this.props.id,
        profile = this.state.currentIdentity.profile,
        verifications = this.state.currentIdentity.verifications

    return (
      <div className="row">
        <div className="col-md-6">
          <div className="profile-dropdown-tab">
            { profile ?
            <div className="profile-wrap">
              <div className="idcard-block">
                <div className="id-flex">
                  <img className="img-idcard" src={getAvatarUrl(profile)} />
                  <div className="overlay"></div>
                </div>
              </div>
              <div className="idcard-wrap">
                <div className="idcard-blockchainid">
                  <h4>{blockchainId}</h4>
                </div>
                <h1 className="idcard-name">{getName(profile)}</h1>
                <div className="id-social">
                  <div>
                    <ul>
                      {getVerifiedAccounts(profile, verifications).map(function(account) {
                        return (
                          <AccountListItem
                            key={account.service + '-' + account.identifier}
                            service={account.service}
                            identifier={account.identifier}
                            proofUrl={account.proofUrl} />
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            : null }
          </div>
        </div>
        <div className="col-md-6">
          <div>
            <Link to={this.props.location.pathname + "/edit"}>
              Edit
            </Link>
          </div>
          <div>
            <Link to={this.props.location.pathname + "/export"}>
              Export
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
