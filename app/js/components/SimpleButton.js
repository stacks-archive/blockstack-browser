import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Spinner } from '@components/ui/components/spinner'

export default class OldButton extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'primary',
      'secondary',
      'tertiary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
      'link'
    ]),
    size: PropTypes.oneOf(['sm', 'lg', 'xs']),
    block: PropTypes.bool,
    outline: PropTypes.bool,
    pill: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    className: PropTypes.string,
    to: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  render() {
    const { type, size, block, outline, pill, loading, disabled, active, to, className, ...rest } = this.props
    const isDisabled = disabled || loading
    const classes = [
      'btn',
      size && `btn-${size}`,
      block && 'btn-block',
      pill && 'btn-pill',
      active && 'btn-active'
    ]
    if (type) {
      if (outline) {
        classes.push(`btn-outline-${type}`)
      }
      else {
        classes.push(`btn-${type}`)
      }
    }
    classes.push(className)

    const classNames = classes.filter(s => !!s).join(' ')
    const content = loading ? (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {this.props.children}
        <div style={{ marginLeft: '10px' }}>
          <Spinner size={18} />
        </div>
      </div>
    ) : this.props.children

    return to ? (
      <Link to={to} className={classNames} disabled={isDisabled} {...rest}>
        {content}
      </Link>
    ) : (
      <button className={classNames} disabled={isDisabled} {...rest}>
        {content}
      </button>
    )
  }
}
