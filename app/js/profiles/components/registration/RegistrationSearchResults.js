import React, { PropTypes, Component } from 'react'
import { browserHistory } from 'react-router'
import roundTo from 'round-to'

const availabilityHeaderStyle = {
  marginTop: '1em',
  marginBottom: '0.5em'
}

class RegistrationSearchResults extends Component {
  static propTypes = {
    showSearchBox: PropTypes.func.isRequired,
    searchingUsername: PropTypes.string,
    nameSuffixes: PropTypes.array.isRequired,
    availableNames: PropTypes.object.isRequired,
    ownerAddress: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.onRegisterFreeUserNameClick = this.onRegisterFreeUserNameClick.bind(this)
    this.onBuyUserNameClick = this.onBuyUserNameClick.bind(this)
  }

  onCancelClick() {
    browserHistory.push('/profiles')
  }

  onRegisterFreeUserNameClick(name) {
    browserHistory.push(`/profiles/i/add-username/${this.props.ownerAddress}/select/${name}`)
  }

  onBuyUserNameClick(name) {
    browserHistory.push(`/profiles/i/add-username/${this.props.ownerAddress}/select/${name}`)
  }

  render() {
    return (
      <div>
        <a
          href=""
          className="pull-left"
          onClick={this.props.showSearchBox}
        >
          &lt; Back
        </a>
        <br />

        <h3 className="modal-heading">Available names</h3>

        <div className="modal-body">
          {this.props.searchingUsername ?
            this.props.nameSuffixes.map((nameSuffix) => {
              const name = `${this.props.searchingUsername}.${nameSuffix}`
              const nameAvailabilityObject = this.props.availableNames[name]
              const searching = !nameAvailabilityObject ||
              nameAvailabilityObject.checkingAvailability
              const isSubdomain = nameSuffix.split('.').length > 1

              const available = nameAvailabilityObject &&
                nameAvailabilityObject.available
              const checkingPrice = nameAvailabilityObject &&
                nameAvailabilityObject.checkingPrice
              let price = 0
              if (nameAvailabilityObject) {
                price = nameAvailabilityObject.price
              }
              price = roundTo.up(price, 6)

              return (
                <div key={nameSuffix}>
                {searching ?
                  <div className="username-check">
                    <h4>Checking {name}...</h4>
                    <button
                      type="button"
                      className="btn btn-secondary btn-block"
                      onClick={this.onCancelClick}
                    >
                      Cancel
                    </button>
                  </div>
                  :
                  <div>
                    {available ?
                      <div>
                        <h4 style={availabilityHeaderStyle}>{name}</h4>
                        {isSubdomain ?
                          <div className="username-result">
                            <button
                              className="btn btn-primary btn-block"
                              onClick={() => this.onRegisterFreeUserNameClick(name)}
                            >
                              Get <strong>{name}</strong> for free
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-block"
                              onClick={this.onCancelClick}
                            >
                              Cancel
                            </button>
                          </div>
                        :
                          <div>
                          {checkingPrice ?
                            <div className="progress">
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                aria-valuenow="100"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: '100%' }}
                              >
                              Checking price...
                              </div>
                            </div>
                            :
                            <div className="username-result">
                              <button
                                className="btn btn-primary btn-block"
                                onClick={() => this.onBuyUserNameClick(name)}
                              >
                                Buy <strong>{name}</strong> for {price} bitcoins
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-block"
                                onClick={this.onCancelClick}
                              >
                                Cancel
                              </button>
                            </div>

                          }
                          </div>
                        }
                      </div>
                      :
                      <div>
                        <h4 style={availabilityHeaderStyle}>{name}</h4>
                        <button
                          className="btn btn-primary btn-block"
                          disabled
                        >
                          {name} is already taken
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-block"
                          onClick={this.onCancelClick}
                        >
                          Cancel
                        </button>
                      </div>
                    }
                  </div>
                }
                </div>
              )
            })
            :
            null
          }
        </div>
      </div>
    )
  }
}

export default RegistrationSearchResults
