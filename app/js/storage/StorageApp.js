import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StatusBar from '../components/StatusBar'
import StorageSideBar from './components/StorageSideBar'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class StorageApp extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const childPath = this.props.children.props.route.path
    const activeTabUrl = `/storage/${childPath}`

    return (
      <div className="body-inner bkg-white">
        <StatusBar />
        <div className="storage-sidebar-wrap">
          <StorageSideBar activeTab={activeTabUrl} />
        </div>
        <div className="storage-content-wrap">
          <div className="vertical-split-content">
            <div col-md-12>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageApp)
