import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { SearchActions } from '../store/search'
import SearchItem from './SearchItem'

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    query: state.search.query,
    results: state.search.results
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SearchActions, dispatch)
}

class SearchBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    resultCount: PropTypes.number.isRequired,
    timeout: PropTypes.number.isRequired,
    api: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
    searchIdentities: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      query: '',
      searchResults: [],
      timeoutId: null,
      placeholder: this.props.placeholder
    }

    this.onQueryChange = this.onQueryChange.bind(this)
    this.submitQuery = this.submitQuery.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  componentHasNewProps(props) {
    this.setState({
      searchResults: props.results.slice(0, this.props.resultCount)
    })
  }

  componentWillMount() {
    this.componentHasNewProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.componentHasNewProps(nextProps)
  }

  submitQuery(query) {
    this.props.searchIdentities(
      query, this.props.api.searchUrl, this.props.api.nameLookupUrl)
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
        <div>
          <input type="text"
            className="form-control form-control-sm"
            placeholder={this.state.placeholder} 
            name="query" value={this.state.query}
            onChange={this.onQueryChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur} />
        </div>
        <ul className="list-group">
          {this.state.searchResults.map((result, index) => {
            if (result.profile && result.username) {
              return (
                <SearchItem key={result.username + '.id'}
                  id={result.username + '.id'}
                  profile={result.profile} />
              )
            }
          })}
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)
