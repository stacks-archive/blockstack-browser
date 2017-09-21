import React, { Component, PropTypes } from 'react'

import Image from '../../components/Image'

class IdentityItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    pending: PropTypes.bool.isRequired,
    ownerAddress: PropTypes.string.isRequired,
    canAddUsername: PropTypes.bool.isRequired,
    isDefault: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    return (
      <a href="" onClick={this.props.onClick} className="card card-default m-b-35">
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
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      this.props.router.push(`/profiles/i/add-username/${this.props.ownerAddress}/search`)
                    }}
                  >
                   Add username
                 </a>
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
                  <span>Default ID <i className="fa fa-check"></i></span>
                :
                  <span>&nbsp;</span>
                }
              </li>
            </ul>
          </div>
        </div>
      </a>
    )
  }
}

export default IdentityItem
