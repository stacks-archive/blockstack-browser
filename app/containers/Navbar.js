import React, { Component, PropTypes } from 'react'
import { Link, History } from 'react-router'

var BackButton = React.createClass({
  mixins: [ History ],
  render() {
    return (
      <div>
        <button onClick={() => this.history.goBack()}>
          {this.props.children}
        </button>
     </div>
   )
 }
})

var ForwardButton = React.createClass({
  mixins: [ History ],
  render() {
    return (
      <div>
        <button onClick={() => this.history.goForward()}>
          {this.props.children}
        </button>
     </div>
   )
 }
})

export default class Navbar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-left">
              <li>
                <BackButton>
                  &lt;
                </BackButton>
              </li>
              <li>
                <ForwardButton>
                  &gt;
                </ForwardButton>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to="/settings">
                  <img src="images/ui-32px-outline-1_settings-gear-64.svg"
                    className="nav-icon"/>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
