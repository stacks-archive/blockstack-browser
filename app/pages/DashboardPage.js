import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class DashboardPage extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="container">
        <section className="container-fluid wrapper">
          <div className="col-sm-12 m-t-2">
            <h4 className="text-xs-center lead-out">My Apps</h4>
            <div>
              <h4 className="text-xs-center">(no apps installed)</h4>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)