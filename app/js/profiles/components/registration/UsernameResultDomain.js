import React from 'react'
import { Link } from 'react-router'

const UsernameResultDomain = (props) => {
  const {
    name,
    index,
    price,
    checkingPrice
  } = props

  const checking = (
    <div className="progress">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow="100"
        aria-valuemin="0"
        aria-valuemax="100"
        style={{ width: '100%' }}
      >
        Checking price...
      </div>
    </div>
  )

  const result = (
    <Link
      className="btn btn-primary btn-block"
      to={`/profiles/i/add-username/${index}/select/${name}`}
    >
      Register for {price} bitcoins
    </Link>
  )

  return (
    <div className="username-search-result">
      <h4>{name}</h4>
      {checkingPrice ? checking : result}
    </div>
  )
}
UsernameResultDomain.defaultProps = {
  checkingPrice: true
}

export default UsernameResultDomain
