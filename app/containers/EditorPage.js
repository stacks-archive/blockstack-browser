import React, { Component } from 'react'
import Editor from '../components/Editor'
import Header from '../components/Header'

class EditorPage extends Component {
  render() {
    return (
      <div>
        <Header />
        <Editor />
      </div>
    )
  }
}

export default EditorPage