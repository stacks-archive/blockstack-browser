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
        <section>
          <div className="container-fluid">
            <h6 className="text-xs-center text-feat-dash">Featured Apps, coming soon...</h6> 
          </div>
          <div className="container-fluid no-padding">
            <div className="col-sm-12 app-container no-padding">
              <div className="col-sm-4 no-padding app-box-container">
                <img className="app-box" src="/images/app-box-chord@2x.png" />
              </div>
              <div className="col-sm-4 no-padding app-box-container">
                <img className="app-box" src="/images/app-box-greenleaf@2x.png" />
              </div>
              <div className="col-sm-4 no-padding app-box-container">
                <img className="app-box" src="/images/app-box-guild@2x.png" />
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <h1 className="clean-font text-xs-center p-t-3">Browse the decentralized web</h1> 
          </div>
          <div className="container-fluid">
              <div className="col-sm-6 offset-sm-3 text-xs-center">
                <h5>Blockstack browser is the world’s first browser that enables you to browse the decentralized web</h5>
              </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)