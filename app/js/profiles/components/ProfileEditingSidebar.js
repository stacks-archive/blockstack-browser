import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class ProfileEditingSidebar extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    activeTab: PropTypes.string
  }

  render() {
    let tabs = [
      { label: 'Basic Info', isActive: false },
      { label: 'Photos', isActive: false },
      { label: 'Social Accounts', isActive: false },
      { label: 'Digital Keys', isActive: false },
      { label: 'Address', isActive: false },
    ]
    tabs.map((tab) => {
      if (tab.label === this.props.activeTab) {
        tab.isActive = true
      }
    })

    return (
      <div className="list-group">
        {tabs.map((tab, index) => {
          let className = 'list-group-item item-sidebar-primary'
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