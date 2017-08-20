import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import InputGroup from '../components/InputGroup'
import { AccountActions } from '../account/store/account'


import log4js from 'log4js'

const logger = log4js.getLogger('profiles/ZoneFilePage.js')

function mapStateToProps(state) {
  return {
    zoneFileUrl: state.settings.api.zoneFileUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class EditProfilePage extends Component {
  static propTypes = {
    zoneFileUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      zoneFile: '',
      agreed: false
    }
    this.onToggle = this.onToggle.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.reset = this.reset.bind(this)
    this.updateZoneFile = this.updateZoneFile.bind(this)
  }

  onToggle(event) {
    this.setState({
      [event.target.name]: event.target.checked
    })
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  reset(event) {
    logger.trace('reset')
    event.preventDefault()
  }

  updateZoneFile(event) {
    logger.trace('updateZoneFile')
    event.preventDefault()
  }

  render() {
    const agreed = this.state.agreed
    const zoneFile = this.state.zoneFile
    return (
      <div className="card-list-container profile-content-wrapper">
        <div>
          <div className="vertical-split-content">
            <div className="row">
              <div className="col-md-3 sidebar-list">
              </div>
              <div className="col-md-7">
                <h1 className="h1-modern">
                  Update zone file
                </h1>
                <p>
                Updating your zone file is an advanced feature and can break
                Blockstack name and profile. It requires broadcasting a
                transaction on Bitcoin network and costs Bitcoin.
                </p>
                <form
                  className="form-check"
                  onSubmit={this.updateZoneFile}
                >
                  <textarea
                    className="form-control"
                    name="zoneFile"
                    data={zoneFile}
                    onChange={this.onValueChange}
                    required
                    rows={5}
                  />
                  <fieldset>
                    <label
                      className="form-check-label"
                      style={{
                        fontSize: 'inherit',
                        marginBottom: '1em',
                        marginTop: '1em',
                        textTransform: 'none'
                      }}
                    >
                      <input
                        name="agreed"
                        checked={agreed}
                        onChange={this.onToggle}
                        type="checkbox"
                      />
                      &nbsp;I understand this could break my Blockstack
                      name and costs money.
                    </label>
                  </fieldset>

                  <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={!agreed}
                  >
                    Broadcast update
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={this.reset}
                  >
                    Reset
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfilePage)
