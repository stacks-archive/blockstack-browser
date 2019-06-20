import React from 'react'
import { Link } from 'react-router'

type Props = {
  name: string,
  index: number
}

const UsernameResultSubdomain = (props: Props) => {
  const {
    name,
    index
  } = props

  return (
    <div className="username-search-result">
      <h4>{name}</h4>
      <Link
        className="btn btn-primary btn-block"
        to={`/profiles/i/add-username/${index}/select/${name}`}
      >
        Register for free
      </Link>

    </div>
  )
}

export default UsernameResultSubdomain
