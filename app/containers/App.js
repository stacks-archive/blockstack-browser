import React, { Component, PropTypes} from 'react';
import DevTools from './DevTools';
import Header from '../components/Header';

class DevelopmentApp extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <DevTools />
      </div>
    );
  }
}

class ProductionApp extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports = ProductionApp
} else {
  module.exports = DevelopmentApp
}
