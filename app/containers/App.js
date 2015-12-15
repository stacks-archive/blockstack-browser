import React, { Component, PropTypes } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3 col-sm-2 col-md-1 sidebar col-without-padding">
              <Sidebar />
            </div>
            <div className="col-xs-9 col-sm-10 col-md-11 col-without-padding">
              {this.props.children}
              {
                (() => {
                  if (process.env.NODE_ENV !== 'production') {
                    const DevTools = require('./DevTools')
                    return <DevTools />
                  }
                })()
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App