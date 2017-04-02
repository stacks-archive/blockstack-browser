import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Alert extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    url: PropTypes.string
  }

  constructor() {
    super()

    this.state = {
      shown: true
    }

    this.hide = this.hide.bind(this)
  }

  hide() {
    this.setState({
      shown: false
    })
  }

  render() {
    return (
      <div>
        { this.state.shown ?
        <div className={`alert alert-dismissible fade in alert-${this.props.status}`} role="alert">
          <button className="close" data-dismiss="alert" aria-label="Close" onClick={this.hide}>
            <span aria-hidden="true">&times;</span>
          </button>
          { this.props.url ?

            <Link to={this.props.url} className="alert-link">
              <span dangerouslySetInnerHTML={{__html: this.props.message}}></span>
            </Link>
            :
            <span dangerouslySetInnerHTML={{__html: this.props.message}}></span>
          }
        </div>
        : null }
      </div>
    )
  }
}

export default Alert
