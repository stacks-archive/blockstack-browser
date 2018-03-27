import React from 'react'
import PropTypes from 'prop-types'

const Navigation = props => {
  const {
    previous,
    next,
    previousLabel = 'Previous',
    nextLabel = 'Next'
  } = props

  return (
    <div className="onboarding-nav">
      <button className="onboarding-nav__btn" onClick={previous}>{previousLabel}</button>
      <button className="onboarding-nav__btn" onClick={next}>{nextLabel}</button>
    </div>
  )
}

Navigation.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  previousLabel: PropTypes.string,
  nextLabel: PropTypes.string
}

export default Navigation
