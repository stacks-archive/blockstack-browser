import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ToolTip from '@components/ToolTip'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { UserAvatar } from '@blockstack/ui'

import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

export class IdentityItem extends Component {
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
    profileUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  transferFromOnenameClick = event => {
    event.preventDefault()
    event.stopPropagation()
    logger.info('transferFromOnenameClick')
    const identityAddress = this.props.ownerAddress
    const profileUrl = this.props.profileUrl
    const url = `https://onename.com/settings?action=export&address=${identityAddress}&url=${profileUrl}`
    logger.debug(`transferFromOnenameClick: Redirecting to ${url}...`)
    const win = window.open(url, '_blank')
    win.focus()
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
        <div>
          <div className="avatar-sm float-left" style={{ display: 'inline' }}>
            <UserAvatar
              id={this.props.ownerAddress}
              username={this.props.username || '?'}
              avatarUrl={this.props.avatarUrl}
            />
          </div>
          <div style={{ display: 'inline' }}>
            <ul className="container-fluid list-card">
              <li>
                <p className="card-title">
                  {this.props.canAddUsername ? (
                    <div>
                      <a
                        href="#"
                        onClick={event => {
                          event.preventDefault()
                          event.stopPropagation()
                          this.props.router.push(
                            `/profiles/i/add-username/${
                              this.props.index
                            }/search`
                          )
                        }}
                      >
                        Add username
                      </a>
                    </div>
                  ) : (
                    <span>
                      {this.props.username}
                      {this.props.pending ? (
                        <i
                          className="fa fa-fw fa-clock-o fa-sm text-secondary"
                          data-tip
                          data-for="usernamePending"
                        />
                      ) : null}
                    </span>
                  )}
                </p>
              </li>
              <li>
                <div style={{ marginTop: '6px' }}>
                  <p className="card-subtitle text-secondary">
                    <small data-tip data-for="ownerAddress">
                      ID-{this.props.ownerAddress}
                    </small>
                  </p>
                </div>
              </li>
              <li>
                {this.props.isDefault ? (
                  <span className="text-secondary">
                    <small>
                      Default ID <i className="fa fa-check" />
                    </small>
                  </span>
                ) : (
                  <span>&nbsp;</span>
                )}
              </li>
            </ul>

            {this.props.canAddUsername ? (
              <div onClick={e => e.stopPropagation()}>
                <ContextMenuTrigger
                  id={`menu-${this.props.ownerAddress}`}
                  holdToDisplay={0}
                >
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'absolute',
                      right: '10px',
                      bottom: '10px',
                      width: '20px',
                      height: '20px',
                      fontSize: '25px',
                      paddingBottom: '15px',
                      color: '#AEAEAE'
                    }}
                  >
                    &#8230;
                  </div>
                </ContextMenuTrigger>
                <ContextMenu id={`menu-${this.props.ownerAddress}`}>
                  <MenuItem onClick={this.transferFromOnenameClick}>
                    <span className="text-secondary">
                      Transfer username from Onename to this ID
                    </span>
                  </MenuItem>
                </ContextMenu>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

export default IdentityItem
