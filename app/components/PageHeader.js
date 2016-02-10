import React, { Component, PropTypes } from 'react'

class PageHeader extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
  }

  render() {
    return (
      <div>
        <div className="page-header-wrap">
          <div className="container-fluid page-header p-r-5">
            <div className="pull-left m-t-1">
              <span className="m-l-2">
                <img src="images/ch-bw-rgb-rev.svg" alt="Chord logo" width="60px" />
              </span>
            </div>
            <h1 className="type-inverse m-t-11">
              {this.props.title}
            </h1>
            { this.props.subtitle ?
            <h4 className="type-inverse">
              {this.props.subtitle}
            </h4>
            : null }
          </div>
        </div>
      </div>
    )
  }
}

export default PageHeader