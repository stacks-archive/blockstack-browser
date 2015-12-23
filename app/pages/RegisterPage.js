import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import InputGroup from '../components/InputGroup'
import * as IdentityActions from '../actions/identities'

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class RegisterPage extends Component {
  static propTypes = {
    createNewIdentity: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      id: ''
    }

    this.onChange = this.onChange.bind(this)
    this.registerIdentity = this.registerIdentity.bind(this)
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  registerIdentity(event) {
    console.log(this.state.id)
    this.props.createNewIdentity(this.state.id)
  }

  render() {
    return (
      <div>
        <div>
          <h3>Register Identity</h3>

          <InputGroup label="Username" placeholder="Username"
            data={this.state} name="id" onChange={this.onChange} />

          <div>
            <button className="btn btn-primary" onClick={this.registerIdentity}>Register</button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage)

/*
<div>
  <label>Cost</label>

  <pre><code>$2</code></pre>

  <p><i>Note: this amount will be pulled from your local Bitcoin balance.</i></p>
</div>
*/