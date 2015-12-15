import React, { Component, PropTypes } from 'react'
import { Link, History } from 'react-router'

var BackButton = React.createClass({
  mixins: [ History ],
  render() {
    return (
      <button onClick={() => this.history.goBack()}>
        {this.props.children}
      </button>
   )
 }
})

var ForwardButton = React.createClass({
  mixins: [ History ],
  render() {
    return (
      <button onClick={() => this.history.goForward()}>
        {this.props.children}
      </button>
   )
 }
})

export default class Navbar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
          <div className="navbar-table">
            <div className="navbar-tab navbar-1-12-tab">
              <BackButton >
                &lt;
              </BackButton>
              <ForwardButton>
                &gt;
              </ForwardButton>
            </div>
            <div className="navbar-tab navbar-10-12-tab">
                <input className="form-control" placeholder="search" />
            </div>
            <div className="navbar-tab navbar-1-12-tab">
                <Link to="/settings">
                  <img src="images/ui-32px-outline-1_settings-gear-64.svg"
                    className="nav-icon"/>
                </Link>
            </div>
          </div>
      </nav>
    )
  }
}
