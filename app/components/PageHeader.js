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
          <div className="container-fluid page-header p-r-1">
            <div className="pull-left m-t-1">
              <span className="header-logo p-l-2 m-l-1">
                <img src="images/blockstack-rev.svg" alt="Blockstack logo" width="100px" />
              </span>
            </div>
            <h1 className="type-inverse m-t-11">
              {this.props.title}
            </h1>
            { this.props.subtitle ?
            <h5 className="type-inverse p-r-1">
              {this.props.subtitle}
            </h5>
            : null }
          </div>
        </div>
      </div>
    )
  }
}

export default PageHeader