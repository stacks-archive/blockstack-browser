import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class ProfileEditingSidebar extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    activeTab: PropTypes.string
  }

  render() {
    let tabs = [
      { label: 'basic info', isActive: false },
      { label: 'photos', isActive: false },
      { label: 'social accounts', isActive: false },
      { label: 'private info', isActive: false },
      { label: 'public keys', isActive: false }
    ]
    tabs.map((tab) => {
      if (tab.label === this.props.activeTab) {
        tab.isActive = true
      }
    })

    return (
      <div className="list-group">
        {tabs.map((tab, index) => {
          let className = 'list-group-item'
          if (tab.isActive) {
            className += ' active'
          }
          return (
            <button key={index} onClick={() => {this.props.onClick(tab.label)}}
                    className={className}>
              {tab.label}
            </button>
          )
        })}
      </div>
    )
  }
}

export default ProfileEditingSidebar

/*
      <div className="list-group">
        <Link to={`/profile/local/${this.props.itemIndex}/edit/basicinfo`}
          className="list-group-item">
          Basic Info
        </Link>
        <Link to={`/profile/local/${this.props.itemIndex}/edit/photos`}
          className="list-group-item">
          Photos
        </Link>
        <Link to={`/profile/local/${this.props.itemIndex}/edit/social`}
          className="list-group-item">
          Social Accounts
        </Link>
        <Link to={`/profile/local/${this.props.itemIndex}/edit/privateinfo`}
          className="list-group-item">
          Private Info
        </Link>
        <Link to={`/profile/local/${this.props.itemIndex}/edit/keys`}
          className="list-group-item">
          Bitcoin and PGP Keys
        </Link>
      </div>
*/