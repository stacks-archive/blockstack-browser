import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import roundTo from 'round-to'

const availabilityHeaderStyle = {
  marginTop: '1em',
  marginBottom: '0.5em'
}

const RegistrationSearchResults = (props) => (
  <div>
    <h3 className="modal-heading">Available names</h3>

    <div className="modal-body">
      {props.searchingUsername ?
        props.nameSuffixes.map((nameSuffix) => {
          const name = `${props.searchingUsername}.${nameSuffix}`
          const nameAvailabilityObject = props.availableNames[name]
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
              <div className="account-check">
                <h4>Checking {name}...</h4>
                <Link
                  to="/profiles"
                  className="btn btn-secondary btn-block"
                >
                  Cancel
                </Link>
              </div>
              :
              <div>
                {available ?
                  <div>
                    <h4 style={availabilityHeaderStyle}>{name}</h4>
                    {isSubdomain ?
                      <div className="username-search-result">
                        <Link
                          className="btn btn-primary btn-block"
                          to={`/profiles/i/add-username/${props.ownerAddress}/select/${name}`}
                        >
                          Get <strong>{name}</strong> for free
                        </Link>
                        <Link
                          to={`/profiles/i/add-username/${this.state.ownerAddress}/search`}
                          className="btn btn-secondary btn-block"
                        >
                          Cancel
                        </Link>
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
                        <div className="username-search-result">
                          <Link
                            className="btn btn-primary btn-block"
                            to={`/profiles/i/add-username/${props.ownerAddress}/select/${name}`}
                          >
                            Buy <strong>{name}</strong> for {price} bitcoins
                          </Link>
                          <button
                            onClick={props.showSearchBox}
                            className="btn btn-secondary btn-block"
                          >
                            Back
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
                      onClick={props.showSearchBox}
                      className="btn btn-secondary btn-block"
                    >
                      Back
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

RegistrationSearchResults.propTypes = {
  showSearchBox: PropTypes.func.isRequired,
  searchingUsername: PropTypes.string,
  nameSuffixes: PropTypes.array.isRequired,
  availableNames: PropTypes.object.isRequired,
  ownerAddress: PropTypes.string.isRequired
}

export default RegistrationSearchResults
