import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import styles from '../styles/Counter.module.css'
import * as CounterActions from '../actions/counter'

function mapStateToProps(state) {
  return {
    counter: state.counter
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch)
}

class Counter extends Component {
  static propTypes = {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    incrementAsync: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired
  }

  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props
    return (
      <div>
        <div className={`counter ${styles.counter}`}>
          {counter}
        </div>
        <div className={styles.btnGroup}>
          <button className={styles.btn} onClick={increment}>
            <i className="fa fa-plus"></i>
          </button>
          <button className={styles.btn} onClick={decrement}>
            <i className="fa fa-minus"></i>
          </button>
          <button className={styles.btn} onClick={incrementIfOdd}>odd</button>
          <button className={styles.btn} onClick={() => incrementAsync()}>async</button>
        </div>
      </div>
    )
  }
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
