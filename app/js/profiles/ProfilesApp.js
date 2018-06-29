import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Navbar from '../components/Navbar'

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class ProfilesApp extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilesApp)
