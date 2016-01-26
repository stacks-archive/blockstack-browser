import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { isABlockstoreName } from '../utils/name-utils'

function mapStateToProps(state) {
  return {
    query: state.search.query,
    currentId: state.identities.current.id
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class AddressBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    timeout: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      query: '',
      timeoutId: null,
      placeholder: this.props.placeholder,
      routerUnlistener: null
    }

    this.onQueryChange = this.onQueryChange.bind(this)
    this.submitQuery = this.submitQuery.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.locationHasChanged = this.locationHasChanged.bind(this)
  }

  locationHasChanged(location) {
    let pathname = location.pathname,
        query = null
    if (/^\/profile\/blockchain\/.*$/.test(pathname)) {
      const domainName = pathname.replace('/profile/blockchain/', '')
      if (isABlockstoreName(domainName)) {
        query = pathname.replace('/profile/blockchain/', '')
      }
    } else if (/^\/profile\/local\/[0-9]+/.test(pathname)) {
      query = 'local:/' + pathname.replace('/local/', '/')
    } else if (/^\/search\/.*$/.test(pathname)) {
      // do nothing
    } else {
      query = 'local:/' + pathname
    }
    if (query) {
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
    if (isABlockstoreName(query)) {
      newPath = `/profile/blockchain/${query}`
    } else {
      newPath = `/search/${query.replace(' ', '%20')}`
    }
    this.context.router.push(newPath)
  }

  onFocus(event) {
    this.setState({
      placeholder: ''
    })
  }

  onBlur(event) {
    this.setState({
      placeholder: this.props.placeholder
    })
  }

  onQueryChange(event) {
    const query = event.target.value

    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId)
    }

    const timeoutId = setTimeout(() => {
      this.submitQuery(query)
    }, this.props.timeout)

    this.setState({
      query: query,
      timeoutId: timeoutId
    })
  }

  render() {
    return (
      <div>
        <input type="text"
          className="form-control form-control-sm"
          placeholder={this.state.placeholder} 
          name="query" value={this.state.query}
          onChange={this.onQueryChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressBar)
