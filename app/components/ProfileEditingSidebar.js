import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class ProfileEditingSidebar extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="list-group">
        <button onClick={() => {this.props.onClick(0)}} className="list-group-item">
          Basic Info
        </button>
        <button onClick={() => {this.props.onClick(1)}} className="list-group-item">
          Photos
        </button>
        <button onClick={() => {this.props.onClick(2)}} className="list-group-item">
          Social Accounts
        </button>
        <button onClick={() => {this.props.onClick(4)}} className="list-group-item">
          Public Keys
        </button>
        <button onClick={() => {this.props.onClick(3)}} className="list-group-item">
          Private Info
        </button>
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