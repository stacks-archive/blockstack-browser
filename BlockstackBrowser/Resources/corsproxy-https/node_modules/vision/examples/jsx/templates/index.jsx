var React = require('react/addons');
var Layout = require('./layout.jsx');

var Component = React.createClass({
  render: function() {
    return (
      <Layout>
        <h1>{this.props.title}</h1>
        <p>{this.props.message}</p>
      </Layout>
    );
  }
});

module.exports = Component;
