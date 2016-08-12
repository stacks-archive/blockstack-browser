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
      <div className="">
        <section className="">
          <div className="container-fluid">
            <h6 className="clean-font text-xs-center m-t-1 m-b-1">Featured Apps (coming soon...)</h6> 
          </div>
          <div className="col-sm-12 app-container no-padding">
            <div className="col-sm-4 app-box-container app-box-gutter no-padding">
              <img className="app-box" src="images/app-box-chord@2x.png" />
            </div>
            <div className="col-sm-4 app-box-container app-box-gutter no-padding">
              <img className="app-box" src="images/app-box-greenleaf@2x.png" />
            </div>
            <div className="col-sm-4 app-box-container no-padding">
              <img className="app-box" src="images/app-box-guild@2x.png" />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)