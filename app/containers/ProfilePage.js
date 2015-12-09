import React, { Component } from 'react'
import Profile from '../components/Profile'
import Header from '../components/Header'

class ProfilePage extends Component {
  render() {
    return (
      <div>
        <Header />
        <Profile />
      </div>
    )
  }
}

export default ProfilePage