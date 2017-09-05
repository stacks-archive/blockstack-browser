import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import HomeButton from '../components/HomeButton'
import SearchBar from './components/SearchBar'
import StatusBar from '../components/StatusBar'


function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class ProfilesApp extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="app-wrap-profiles">
          <StatusBar />
        <div className="container-fluid site-wrapper">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilesApp)
