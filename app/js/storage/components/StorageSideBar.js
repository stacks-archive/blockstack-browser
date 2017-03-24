import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class StorageSideBar extends Component {
  static propTypes = {
    activeTab: PropTypes.string
  }

  render() {
    let tabs = [
      { url: '/storage/providers', label: 'providers', isActive: true, disabled: false },
      { url: '/storage/files', label: 'files', isActive: false, disabled: true },
    ]
    tabs.map((tab) => {
      if (tab.url === this.props.activeTab) {
        tab.isActive = true
      }
    })

    return (
      <div>
        <h1 className="type-inverse h1-modern">
          Storage
        </h1>
        <div className="list-group">
          {tabs.map((tab, index) => {
            let className = 'list-group-item list-group-item-sidebar'
            if (tab.isActive) {
              className += ' active'
            }
            if (tab.disabled) {
              return (
                <Link key={index} className={className} disabled>
                  {tab.label}
                </Link>
              )
            } else {
              return (
                <Link key={index} to={tab.url} className={className}>
                  {tab.label}
                </Link>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

export default StorageSideBar
