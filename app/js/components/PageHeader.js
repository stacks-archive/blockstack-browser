import PropTypes from 'prop-types'
import React from 'react'

const PageHeader = props => (
  <div className="page-header">
    <h1 className="type-inverse h1-modern">
      {props.title}
    </h1>
    {props.subtitle ?
      <h5 className="type-inverse p-r-1">
        {props.subtitle}
      </h5>
    : null}
  </div>
)

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}

export default PageHeader
