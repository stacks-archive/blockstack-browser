import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  isABlockstackName, isABlockstackIDName, isABlockstackAppName
} from '../../utils/name-utils'
import { SearchActions } from '../store/search'

function mapStateToProps(state) {
  return {
    query: state.profiles.search.query
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SearchActions, dispatch)
}

class SearchBar extends Component {
  static propTypes = {
    query: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    updateQuery: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      query: this.props.query,
      placeholder: this.props.placeholder
    }

    this.submitQuery = this.submitQuery.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.onQueryChange = this.onQueryChange.bind(this)
  }

  componentWillMount() {
    if (!/^\/profiles\/search\/.*$/.test(location.pathname)) {
      this.props.updateQuery("")
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({
        query: nextProps.query
      })
    }
  }

  componentWillUnmount() {
    this.props.updateQuery("")
  }

  submitQuery(query) {
    let newPath
    if (isABlockstackName(query)) {
      if (isABlockstackIDName(query)) {
        newPath = `/profiles/${query}`
      }
    } else {
      newPath = `/profiles/i/search/${query.replace(' ', '%20')}`
    }
    this.context.router.push(newPath)
  }

  onKeyPress(event) {
    if (event.key === 'Enter' && this.state.query !== '') {
      this.submitQuery(this.state.query)
    }
  }

  onQueryChange(event) {
    this.setState({
      query: event.target.value
    })
  }

  render() {
    return (
      <div className="nav-search m-b-40">
        <input type="text"
          className="form-control form-control-sm"
          placeholder={this.state.placeholder}
          name="query" value={this.state.query}
          onChange={this.onQueryChange}
          onKeyPress={this.onKeyPress} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)


/*

else if (/^local:\/\/.*$/.test(query)) {
      newPath = query.replace('local://', '/')
    }

locationHasChanged(location) {
  let pathname = location.pathname,
      query = null

  if (/^\/profiles\/blockchain\/.*$/.test(pathname)) {
    const domainName = pathname.replace('/profiles/blockchain/', '')
    if (isABlockstackIDName(domainName)) {
      query = pathname.replace('/profiles/blockchain/', '')
    }
  } else if (/^\/app\/.*$/.test(pathname)) {
    const domainName = pathname.replace('local://app/', '')
    if (isABlockstackAppName(domainName)) {
      query = pathname.replace('local://app/', '')
    }
  } else if (/^\/profiles\/local\/[0-9]+.*$/.test(pathname)) {
    query = 'local:/' + pathname.replace('/local/', '/')
  } else if (/^\/profiles\/search\/.*$/.test(pathname)) {
    // do nothing
    query = pathname.replace('/profiles/search/', '').replace('%20', ' ')
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
}*/