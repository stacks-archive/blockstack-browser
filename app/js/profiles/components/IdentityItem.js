import React, { Component, PropTypes } from 'react'
import ToolTip from '../../components/ToolTip'
import Image from '../../components/Image'

class IdentityItem extends Component {
  static propTypes = {
    username: PropTypes.string,
    avatarUrl: PropTypes.string.isRequired,
    pending: PropTypes.bool.isRequired,
    ownerAddress: PropTypes.string.isRequired,
    canAddUsername: PropTypes.bool.isRequired,
    isDefault: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    windowsBuild: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    return (
      <div
        onClick={this.props.onClick}
        className="card card-default m-b-35"
        style={{ cursor: 'pointer' }}
      >
        <ToolTip id="usernamePending">
          <div>
            <div>Name registration in progress...</div>
          </div>
        </ToolTip>
        <ToolTip id="ownerAddress">
          <div>
            <div>This is your identity address.</div>
          </div>
        </ToolTip>
        <ToolTip id="windowsDisabled">
          <div>
            <div>You cannot purchase usernames in the Windows build right now. Feature coming soon!</div>
          </div>
        </ToolTip>
        <div>
          <div className="avatar-sm float-left" style={{ display: 'inline' }}>
            <Image
              src={this.props.avatarUrl}
              fallbackSrc="/images/avatar.png" className="rounded-circle img-cover"
              style={{ display: 'inline-block' }}
            />
          </div>
          <div style={{ display: 'inline' }}>
            <ul className="container-fluid list-card">
              <li>
                <p className="card-title">
                {this.props.canAddUsername ?
                 <div>
                 {this.props.windowsBuild ?
                  <span>
                  Add username
                  <i className="fa fa-fw fa-exclamation fa-sm text-secondary"
                  data-tip
                  data-for="windowsDisabled"></i>
                  </span>
                 :
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      this.props.router.push(`/profiles/i/add-username/${this.props.index}/search`)
                    }}
                  >
                   Add username
                  </a>
                 }
                 </div>
                 :
                  <span>
                    {this.props.username}
                    {this.props.pending ?
                      <i
                        className="fa fa-fw fa-clock-o fa-sm text-secondary"
                        data-tip
                        data-for="usernamePending"
                      ></i>
                      : null}
                  </span>
                }
                </p>
              </li>
              <li>
                <div style={{ marginTop: '6px' }}>
                  <p className="card-subtitle text-secondary">
                    <small data-tip data-for="ownerAddress">
                      {this.props.ownerAddress}
                    </small>
                  </p>
                </div>
              </li>
              <li>
                {this.props.isDefault ?
                  <span className="text-secondary">
                    <small>Default ID <i className="fa fa-check"></i></small>
                  </span>
                :
                  <span>&nbsp;</span>
                }
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default IdentityItem
