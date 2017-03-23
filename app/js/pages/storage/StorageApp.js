import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { PageHeader, StatusBar } from '../../components/index'

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
      <div className="body-inner-white">
        <StatusBar />
        <PageHeader title="Storage" />
        <div className="home-wallet">
        </div>
        <div className="container vertical-split-content">
          <div className="row">
            <div className="col-md-9">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageApp)
