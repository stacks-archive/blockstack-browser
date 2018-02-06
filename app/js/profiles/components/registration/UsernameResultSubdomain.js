import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const UsernameResultSubdomain = (props) => {
  const {
    name,
    index
  } = props;

  return (
    <div className="username-search-result">
      <h4>{name}</h4>
      <Link
        className="btn btn-primary btn-block"
        to={`/profiles/i/add-username/${index}/select/${name}`}
      >
        Get <strong>{name}</strong> for free
      </Link>

    </div>
  )
}
UsernameResultSubdomain.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
}

export default UsernameResultSubdomain;
