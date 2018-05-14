// @flow
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

const AdvancedSidebar = (props) => {
  const tabs = [
    { urlComponent: 'zone-file', label: 'Update zone file', isActive: false },
    { urlComponent: 'transfer-name', label: 'Transfer name', isActive: false }
  ]
  tabs.map((tab) => {
    if (tab.urlComponent === props.activeTab) {
      tab.isActive = true
    }
    return null
  })

  return (
    <div className="list-group">
      {tabs.map((tab, index) => {
        let className = 'list-group-item item-sidebar-account'
        if (tab.isActive) {
          className += ' active'
        }
        return (
          <Link
            key={index}
            to={`/profiles/${props.name}/${tab.urlComponent}`}
            className={className}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

AdvancedSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default AdvancedSidebar
