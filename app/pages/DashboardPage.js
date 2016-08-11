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
          <div className="container-fluid">
            <h6 className="clean-font text-xs-center m-t-1 m-b-1">Featured Apps (coming soon...)</h6> 
          </div>
          <div className="app-container">
            <div className="app-box-container app-box-gutter">
              <img className="app-box" src="images/app-box-chord.jpg" />
              <img className="app-icon" src="images/icon-chord.png" />
            </div>
            <div className="app-box-container app-box-gutter">
              <img className="app-box" src="images/app-box-greenleaf.jpg" />
              <img className="app-icon" src="images/icon-greenleaf.png" />
            </div>
            <div className="app-box-container">
              <img className="app-box" src="images/app-box-guild.jpg" />
              <img className="app-icon" src="images/icon-guild.png" />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)