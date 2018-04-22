import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Navbar from '../components/Navbar'

function mapStateToProps() {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

const ProfilesApp = props => (
  <Fragment>
    <Navbar activeTab="avatar" />
    {props.children}
  </Fragment>
)

ProfilesApp.propTypes = {
  children: PropTypes.node
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilesApp)
