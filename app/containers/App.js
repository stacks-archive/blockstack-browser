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
        <div className="view-with-sidebar">
          <div className="sidebar-section">
            <Sidebar />
          </div>
          <div className="content-section">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
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
        </div>
      </div>
    )
  }
}

export default App