import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AccountSidebar from './components/AccountSidebar'
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
    const childPath = this.props.children.props.route.path
    const activeTabUrl = `/account/${childPath}`

    return (
      <div className="body-inner bkg-white">
        <StatusBar />
        <PageHeader title="Account" />
        <div className="container vertical-split-content">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar activeTab={activeTabUrl} />
            </div>
            <div className="col-md-9">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(AccountApp)
