import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { PageHeader } from '../../components/index'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  let actions = {}
  return bindActionCreators(actions, dispatch)
}

class AppPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentURI: null,
      isLoading: true
    }
  }

  componentHasNewRouteParams(props) {
    if (props.routeParams.name) {
      let routeName = props.routeParams.name.replace('.app', '')
      let currentURI = null

      let routes = {
        'blockstack': 'https://blockstack.org',
        'openbazaar': 'https://openbazaar.org',
        'mediachain': 'http://www.mediachain.io',
        'ipfs': 'https://ipfs.io',
        'arcadecity': 'http://arcade.city',
        'bitcoincore': 'https://bitcoincore.org',
        'coinbase': 'https://www.coinbase.com',
        '21': 'https://21.co',
      }

      if (routeName in routes) {
        currentURI = routes[routeName]
      }

      this.setState({
        currentURI: currentURI,
        isLoading: false
      })
    }
  }

  componentWillMount() {
    this.componentHasNewRouteParams(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams !== this.props.routeParams) {
      this.componentHasNewRouteParams(nextProps)
    }
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        { this.state.currentURI !== null ?
        <webview src={this.state.currentURI}
          style={{ height: '100%'}} autosize="on">
        </webview>
        :
        <div className="container-fluid proid-wrap p-t-4">
          {this.state.isLoading ?
          <h4 className="text-xs-center lead-out">
            Loading...
          </h4>
          :
          <h4 className="text-xs-center lead-out">
            Site not found
          </h4>
          }
        </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppPage)