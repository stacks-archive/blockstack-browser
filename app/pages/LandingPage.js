import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class CreateAccountPage extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="body-inner" style={{ backgroundImage: "url('images/profile-collage.jpg')" }}>
        <div className="container out-block-wrap">
          <div className="container-fluid out-block">
            <div className="row">
              <div className="centered">
                <div className="m-b-4">
                  <img src="images/ch-bw-rgb-rev.svg" alt="Chord logo" width="60px" />
                  <p className="lead-out">browse the blockchain</p>
                </div>
              </div>
              <div className="form-group">
                <Link to="/account/create" className="btn btn-block btn-secondary">
                  Create Account
                </Link>
              </div>
              <div>
                <p className="text-sm inverse text-xs-center">
                  Already have an account?
                  <br />
                  <Link to="/account/restore">Restore from backup</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountPage)
