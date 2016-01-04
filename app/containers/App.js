import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import LandingPage from '../pages/LandingPage'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedMnemonic: PropTypes.string
  }

  render() {
    return (
      <div>
      { this.props.encryptedMnemonic ?
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
        :
        <div>
          <div className="container">
            <LandingPage />
          </div>
        </div>
        }
      </div>
    )
  }
}


export default connect(mapStateToProps)(App)
