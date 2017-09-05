import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import PageHeader from '../components/PageHeader'
import StatusBar from '../components/StatusBar'

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class AccountApp extends Component {
  static propTypes = {
    children: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = { }
  }

  render() {
    return (
      <div className="body-inner bkg-light">
        <StatusBar />
        <PageHeader title="Settings" />
        <div className="container vertical-split-content">

          { this.props.location.pathname !== '/account' ? (
          <div className="row">
            <div className="col-md-12">
              <Link to="/account" className="btn btn-link">
                Back
              </Link>
            </div>
          </div>
          ) : (<div></div>) }

          <div className="row">
            <div className="col-md-12">
              {this.props.children}
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(AccountApp)
