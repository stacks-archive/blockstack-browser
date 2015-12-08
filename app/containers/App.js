import React, { Component, PropTypes } from 'react';
import Header from '../components/Header';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        {
        (() => {
          if (process.env.NODE_ENV !== 'production') {
            const DevTools = require('./DevTools');
            return <DevTools />;
          }
        })()
      }
      </div>
    );
  }
}