import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter'
import * as CounterActions from '../actions/counter'
import Header from '../components/Header'

function mapStateToProps(state) {
  return {
    counter: state.counter
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch)
}

class CounterPage extends Component {
  static propTypes = {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired
  }

  render() {
    return (
      <div>
        <Header />
        <Counter
          increment={this.props.increment}
          incrementIfOdd={this.props.incrementIfOdd}
          incrementAsync={this.props.incrementAsync}
          decrement={this.props.decrement}
          counter={this.props.counter} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CounterPage)