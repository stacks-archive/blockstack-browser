import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  isABlockstackName, isABlockstackIDName, isABlockstackAppName
} from '../utils/name-utils'
import routes from '../routes'

function mapStateToProps(state) {
  return {
    query: state.search.query,
    currentId: state.identities.current.id,
    identityPublicKeychain: state.account.identityAccount.publicKeychain
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class AddressBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      query: '',
      placeholder: this.props.placeholder,
      routerUnlistener: null
    }

    this.onQueryChange = this.onQueryChange.bind(this)
    this.submitQuery = this.submitQuery.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.locationHasChanged = this.locationHasChanged.bind(this)
  }

  locationHasChanged(location) {
    let pathname = location.pathname,
        query = null

    if (/^\/profile\/blockchain\/.*$/.test(pathname)) {
      const domainName = pathname.replace('/profile/blockchain/', '')
      if (isABlockstackIDName(domainName)) {
        query = pathname.replace('/profile/blockchain/', '')
      }
    } else if (/^\/app\/.*$/.test(pathname)) {
      const domainName = pathname.replace('local://app/', '')
      if (isABlockstackAppName(domainName)) {
        query = pathname.replace('local://app/', '')
      }
    } else if (/^\/profile\/local\/[0-9]+.*$/.test(pathname)) {
      query = 'local:/' + pathname.replace('/local/', '/')
    } else if (/^\/search\/.*$/.test(pathname)) {
      // do nothing
      query = pathname.replace('/search/', '').replace('%20', ' ')
    } else if (pathname === '/') {
      query = ''
    } else {
      query = 'local:/' + pathname
    }
    if (query !== null) {
      this.setState({
        query: query
      })
    }
  }

  componentDidMount() {
    this.state.routerUnlistener = this.context.router.listen(this.locationHasChanged)
  }

  componentWillUnmount() {
    this.state.routerUnlistener()
  }

  submitQuery(query) {
    let newPath
    if (isABlockstackName(query)) {
      if (isABlockstackIDName(query)) {
        newPath = `/profile/blockchain/${query}`
      } else if (isABlockstackAppName(query)) {
        newPath = `/app/${query}`
      } else {
        newPath = `/app/${query}`
      }
    } else if (/^local:\/\/.*$/.test(query)) {
      newPath = query.replace('local://', '/')
    } else {
      newPath = `/search/${query.replace(' ', '%20')}`
    }
    this.context.router.push(newPath)
  }

  onKeyPress(event) {
    if (event.key === 'Enter' && this.state.query !== '') {
      this.submitQuery(this.state.query)
      let distinct_id = this.state.identityPublicKeychain
      mixpanel.track('Submit query', { distinct_id: distinct_id })
      mixpanel.track('Perform action', { distinct_id: distinct_id })
    }
  }

  onQueryChange(event) {
    const query = event.target.value
    this.setState({
      query: query
    })
  }

  render() {
    return (
      <div className="browser-search-bar">
        <input type="text"
          className="form-control form-control-sm "
          placeholder={this.state.placeholder} 
          name="query" value={this.state.query}
          onChange={this.onQueryChange}
          onKeyPress={this.onKeyPress} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressBar)
