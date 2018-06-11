import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  isABlockstackName, isABlockstackIDName
} from '@utils/name-utils'
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
      this.props.updateQuery('')
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
    this.props.updateQuery('')
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
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder={this.state.placeholder}
          name="query" value={this.state.query}
          onChange={this.onQueryChange}
          onKeyPress={this.onKeyPress}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)
