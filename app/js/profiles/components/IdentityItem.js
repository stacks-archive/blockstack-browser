import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Image from '../../components/Image'

class IdentityItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    pending: PropTypes.bool.isRequired,
    ownerAddress: PropTypes.string.isRequired,
    canAddUsername: PropTypes.bool.isRequired,
    isDefault: PropTypes.bool,
    setDefaultIdentity: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}

    this.setDefaultIdentity = this.setDefaultIdentity.bind(this)
  }

  setDefaultIdentity(event) {
    event.preventDefault()
    this.props.setDefaultIdentity()
  }

  render() {
    return (
      <Link to={this.props.url} className="card card-default m-b-35">
      <div>
        <div className="avatar-sm float-left" style={{ display: 'inline' }}>
          <Image src={this.props.avatarUrl}
            fallbackSrc="/images/avatar.png" className="rounded-circle img-cover" style={{ display: 'inline-block' }} />
        </div>
        <div style={{ display: 'inline' }}>
          <ul className="container-fluid list-card">
            <li>
              <p className="card-title text-secondary">
                {this.props.label}
              </p>
            </li>
            <li>
              {this.props.canAddUsername ?
               <Link to={`/profiles/i/add-username/${this.props.ownerAddress}/search`}>
                 Add username
               </Link>
               :
                <div>
                   <p className="card-subtitle">
                    {this.props.pending ? '(pending)' : '\u00A0'}
                   </p>
                </div>
              }
            </li>
            <li>
              {this.props.isDefault ?
                <span>Default Profile <i className="fa fa-check"></i></span>
              :
                <a href="#" onClick={this.setDefaultIdentity}>Set as Default Profile</a>
              }
            </li>
          </ul>
        </div>
        </div>
      </Link>
    )
  }
}

export default IdentityItem
