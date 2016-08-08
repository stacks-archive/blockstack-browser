import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { SearchActions } from '../store/search'
import { SearchItem } from '../components/index'

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    searchResults: state.search.results
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SearchActions, dispatch)
}

class SearchPage extends Component {
  static propTypes = {
    searchResults: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      searchResults: [],
      isLoading: true
    }
  }

  componentHasNewRouteParams(routeParams) {
    this.props.searchIdentities(routeParams.query,
      this.props.api.searchUrl, this.props.api.nameLookupUrl)
  }

  componentWillMount() {
    this.componentHasNewRouteParams(this.props.routeParams)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams !== this.props.routeParams) {
      this.componentHasNewRouteParams(nextProps.routeParams)
    }
    this.setState({
      searchResults: nextProps.searchResults,
      isLoading: false
    })
  }

  render() {
    return (
      <div className="container">
        {this.state.searchResults.length ?
        <ul className="list-group">
          {this.state.searchResults.map((result, index) => {
            if (result.profile && result.username) {
              return (
                <SearchItem key={result.username + '.id'}
                  domainName={result.username + '.id'}
                  profile={result.profile} />
              )
            }
          })}
        </ul>
        :
        <div>
        {this.state.isLoading ?
        <h4 className="text-xs-center lead-out">
          Loading...
        </h4>
        :
        <h4 className="text-xs-center lead-out">
          No results found
        </h4>
        }
        </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)
