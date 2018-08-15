import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SearchItem from './components/SearchItem'
import { SearchActions } from './store/search/index'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    searchResults: state.profiles.search.results
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SearchActions, dispatch)
}

class SearchPage extends Component {
  static propTypes = {
    searchResults: PropTypes.array.isRequired,
    searchIdentities: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      searchResults: [],
      isLoading: true
    }
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

  componentHasNewRouteParams(routeParams) {
    logger.trace('componentHasNewRouteParams')
    logger.debug(`Searching for ${routeParams.query}...`)
    this.props.searchIdentities(routeParams.query,
      this.props.api.searchServiceUrl, this.props.api.nameLookupUrl)
  }

  render() {
    return (
      <div className="">
        {this.state.searchResults.length ?
          <ul
            className="list-group"
          >
            {
              this.state.searchResults.map((result) => (
                result.profile && result.username &&
                  <SearchItem
                    key={`${result.username}.id`}
                    domainName={`${result.username}.id`}
                    profile={result.profile}
                  />
              ))
            }
          </ul>
        :
          <div>
          {this.state.isLoading ?
            <h4
              className="text-xs-center lead-out"
            >
            Loading...
            </h4>
        :
            <h4
              className="text-xs-center lead-out"
            >
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
