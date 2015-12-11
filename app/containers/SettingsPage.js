import React, { Component } from 'react'
import Settings from '../components/Settings'
import Header from '../components/Header'

class SettingsPage extends Component {
  render() {
    return (
      <div>
        <Header />
        <Settings />
      </div>
    )
  }
}

export default SettingsPage