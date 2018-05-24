import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'

import { openInNewTab, getWebAccountTypes } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class CustomAccountItem extends Component {
  static propTypes = {
    editing: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    value: PropTypes.string,
    api: PropTypes.object.isRequired,
    placeholder: PropTypes.bool,
    onClick: PropTypes.func,
    onDeleteClick: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  getIdentifier = () => {
    let identifier = this.props.identifier
    if (identifier.length >= 40) {
      identifier = identifier.slice(0, 40) + '...'
    }
    return identifier
  }

  onClick = (e) => {
    this.props.onClick(this.props.service, this.props.identifier)
  }

  onDeleteClick = (e) => {
    e.stopPropagation()
    this.props.onDeleteClick(this.props.index)
  }

  render() {
    const placeholderClass = this.props.placeholder ? "placeholder" : ""
    return (
      <li className={`clickable ${placeholderClass}`} onClick={this.onClick}>  

        <span className="app-account-icon">
          <i className={`fa fa-fw fa-link fa-lg`} />
        </span>

        {!this.props.placeholder && (
          <span className="app-account-identifier">
            {this.props.service === 'custom' ? this.props.value : this.getIdentifier()}
          </span>
        )}

        {!this.props.placeholder && (
          <span className="app-account-service font-weight-normal">
            {this.props.service === 'custom' ? this.getIdentifier() : this.props.service}
          </span>
        )}

        {(!this.props.placeholder && this.props.editing) && (
          <span className="" onClick={this.onDeleteClick}>
            <i className="fa fa-fw fa-trash" />
          </span>
        )}

        {this.props.placeholder && (
          <span className="app-account-service font-weight-normal">
            Add a custom account
          </span>
        )}
      </li>
    )
  }
}

export default connect(mapStateToProps, null)(CustomAccountItem)
