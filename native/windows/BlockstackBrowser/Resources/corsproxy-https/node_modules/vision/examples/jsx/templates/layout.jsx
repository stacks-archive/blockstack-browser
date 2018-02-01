var React = require('react/addons');
var Head = require('./includes/head.jsx');
var Foot = require('./includes/foot.jsx');

var Component = React.createClass({
  render: function() {
    return (
      <html>
        <Head />
        <body>
          {this.props.children}
        </body>
        <Foot />
      </html>
    );
  }
});

module.exports = Component;
