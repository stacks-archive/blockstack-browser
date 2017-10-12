import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class TrustLevelFooter extends Component {
  static propTypes = {
    trustLevel: PropTypes.number.isRequired,
    maxTrustLevel: PropTypes.number.isRequired,
    link: PropTypes.string.isRequired
  }

  render() {
    const stars = (filled, total) => {
      let stars = []
      for(var i=0;i<total;i++) {
        stars.push(i<filled ? <i key={i} className="fa fa-star"></i> : <i key={i} className="fa fa-star-o"></i>)
      }
      return stars
    }

    return (
      <footer className="footer">
        <div className="trust-level-footer-container text-center">
          <Link to={this.props.link}>
            <span>
              Increase your trust level {stars(this.props.trustLevel, this.props.maxTrustLevel)} 
            </span>
          </Link>
        </div>
      </footer>
    )
  }
}

export default TrustLevelFooter
