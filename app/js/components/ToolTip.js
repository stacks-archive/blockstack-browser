import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

const ToolTip = (props) => (
  <ReactTooltip
    place={props.place}
    type={props.type}
    effect={props.effect}
    id={props.id}
    className={props.className}
    offset={props.offset}
  >
    {props.children}
  </ReactTooltip>
)

ToolTip.propTypes = {
  place: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  effect: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  offset: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
}

ToolTip.defaultProps = {
  place: 'bottom',
  type: 'dark',
  effect: 'solid',
  className: 'text-center',
  offset: {
    bottom: '20',
    right: '10'
  }
}

export default ToolTip
