import React, { Component } from 'react'
import Settings from '../components/Settings'
import Header from '../components/Header'

class EditorPage extends Component {
  render() {
    return (
      <div>
        <Header />
        <Settings />
      </div>
    )
  }
}

export default EditorPage