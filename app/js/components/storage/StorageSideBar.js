import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class StorageSideBar extends Component {
  static propTypes = {
    activeTab: PropTypes.string
  }

  render() {
    let tabs = [
      { url: '/storage/providers', label: 'storage', isActive: false },
      { url: '#', label: 'files', isActive: false },
    ]
    tabs.map((tab) => {
      if (tab.url === this.props.activeTab) {
        tab.isActive = true
      }
    })

    return (
      <div className="list-group">
        {tabs.map((tab, index) => {
          let className = 'list-group-item list-group-item-sidebar'
          if (tab.isActive) {
            className += ' active'
          }
          return (
            <Link key={index} to={tab.url} className={className}>
              {tab.label}
            </Link>
          )
        })}
      </div>
    )
  }
}

export default StorageSideBar
