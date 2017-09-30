import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'

import InputGroup from '../../components/InputGroup'

import { getWebAccountTypes } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class EditSocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string,
    verified: PropTypes.bool,
    api: PropTypes.object.isRequired,
    placeholder: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }

    this.getAccountUrl = this.getAccountUrl.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  getAccountUrl() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        let urlTemplate = webAccountTypes[this.props.service].urlTemplate
        if (urlTemplate) {
          accountUrl = urlTemplate.replace('{identifier}', this.props.identifier)
        }
      }
    }
    return accountUrl
  }

  getIconClass() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let iconClass = ''
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      iconClass = webAccountTypes[this.props.service].iconClass
    }
    return iconClass
  }

  getIdentifier() {
    let identifier = this.props.identifier
    if (identifier.length >= 15) {
      identifier = identifier.slice(0, 15) + '...'
    }
    return identifier
  }

  handleClick() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const verifiedClass = !this.props.verified ? "verified" : "pending" 
    const collapsedClass = this.state.collapsed ? "collapsed" : ""

    if (webAccountTypes[this.props.service]) {
      if (!this.props.placeholder) {
        return (
          <div className={`account ${verifiedClass} ${collapsedClass}`} 
            onClick={this.handleClick}>
            <span className="">
              <i className={`fa fa-fw ${this.getIconClass()} fa-lg`} />
            </span>
            <span className="app-account-identifier">
              {this.getIdentifier()}
            </span>
            <span className="app-account-service font-weight-normal">
              {`@${this.props.service}`}
            </span>
            <span className="float-right">
              { this.state.collapsed ? <i className="fa fa-w fa-chevron-down" /> : 
                <i className="fa fa-w fa-chevron-up" />
              }
            </span>

            {!this.state.collapsed && 
              (
                <div>
                  <InputGroup 
                    name="identifier" 
                    label="Username" 
                    data={this.props}
                    stopClickPropagation={true} />
                  <button className="btn btn-block btn-light"
                    onClick={() => {}}>
                    Verify
                  </button>
                </div>
              )
            }
          </div>
        )
      } else {
        return (
          <div className={`account placeholder ${collapsedClass}`} onClick={this.handleClick}>
            <span className="">
              <i className={`fa fa-fw ${this.getIconClass()} fa-lg`} />
            </span>
            <span className="app-account-service font-weight-normal">
              {`Prove your ${this.props.service}`}
            </span>
            <span className="float-right">
              { this.state.collapsed ? <i className="fa fa-w fa-chevron-down" /> : 
                <i className="fa fa-w fa-chevron-up" />
              }
            </span>
          </div>
        )
      }
    } else {
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(EditSocialAccountItem)
