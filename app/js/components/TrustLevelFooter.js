import PropTypes from 'prop-types'
import React, { Component } from 'react'

class TrustLevelFooter extends Component {
  static propTypes = {
    trustLevel: PropTypes.number.isRequired,
    maxTrustLevel: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render() {
    const makeStars = (filled, total) => {
      const stars = []
      for (let i = 0; i < total; i++) {
        let className = i < filled ? 'fa fa-star' : 'fa fa-star-o'
        stars.push(<i key={i} className={className}></i>)
      }
      return stars
    }
    const stars = makeStars(this.props.trustLevel, this.props.maxTrustLevel)

    return (
      <footer className="footer" onClick={this.props.onClick}>
        <div className="trust-level-footer-container text-center">
          {/* <Link to={this.props.link}> */}
          <span>
            Increase your social level {stars}
          </span>
          {/* </Link> */}
        </div>
      </footer>
    )
  }
}

export default TrustLevelFooter
