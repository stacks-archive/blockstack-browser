import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Alert, InputGroup, PageHeader } from '../../components/index'
import { IdentityActions } from '../../store/identities'
import { getNamePrices, isNameAvailable, hasNameBeenPreordered, isABlockstackName } from '../../utils/name-utils'
import { uploadProfile } from '../../utils/index'
function mapStateToProps(state) {
  return {
    username: '',
    localIdentities: state.identities.localIdentities,
    lookupUrl: state.settings.api.nameLookupUrl,
    registerUrl: state.settings.api.registerUrl,
    priceUrl: state.settings.api.priceUrl,
    blockstackApiAppId: state.settings.api.blockstackApiAppId,
    blockstackApiAppSecret: state.settings.api.blockstackApiAppSecret,
    analyticsId: state.account.analyticsId,
    identityAddresses: state.account.identityAccount.addresses,
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class RegisterPage extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    localIdentities: PropTypes.object.isRequired,
    lookupUrl: PropTypes.string.isRequired,
    registerUrl: PropTypes.string.isRequired,
    blockstackApiAppId: PropTypes.string.isRequired,
    blockstackApiAppSecret: PropTypes.string.isRequired,
    analyticsId: PropTypes.string.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    registerName: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      registrationLock: false,
      username: this.props.username,
      nameCost: 0,
      alerts: [],
      type: 'person',
      tlds: {
        person: 'id',
        organization: 'corp'
      },
      nameLabels: {
        person: 'Username',
        organization: 'Domain'
      }
    }

    this.onChange = this.onChange.bind(this)
    this.registerIdentity = this.registerIdentity.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
  }

  onChange(event) {
    if (event.target.name === 'username') {
      const username = event.target.value.toLowerCase().replace(/\W+/g, ''),
      tld = this.state.tlds[this.state.type],
      domainName = `${username}.${tld}`

      this.setState({
        username: username
      })

      this.updateAlert('info', `Checking if ${domainName} is available...`)

      if(username === '') {
        this.setState({
          alerts:[]
        })
        return
      }

      if(this.timer) {
        clearInterval(this.timer)
      }

      event.persist()
      const _this = this

      this.timer = setTimeout( () => {

        if(!isABlockstackName(domainName)) {
          _this.updateAlert('danger', `${domainName} Not valid Blockstack name`)
          return
        }

        isNameAvailable(_this.props.lookupUrl, domainName).then((isAvailable) => {
          if(isAvailable) {
            if(_this.state.username === username) { // don't continue if user has already changed input
              _this.updateAlert('info', `${domainName} is available! Checking price...`)
              getNamePrices(_this.props.priceUrl, domainName).then((prices)=> {
                const cost = prices.total_estimated_cost.btc
                _this.setState({
                  nameCost: cost
                })
                if(_this.state.username === username) // don't update if user has already changed input
                  _this.updateAlert('info', `${username}.id costs ~${cost} btc to register.`)
              })
            }
          } else {
            if(_this.state.username === username) // don't update if user has already changed input
              _this.updateAlert('danger', `${domainName} has already been registered`)
          }
        })
      },
      500) // wait 500ms after user stops typing to check availability 
    }
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{
        status: alertStatus,
        message: alertMessage
      }]
    })
  }

  registerIdentity(event) {
    if (this.state.registrationLock) {
      return
    }

    this.setState({ registrationLock: true })

    const username = this.state.username,
    tld = this.state.tlds[this.state.type],
    domainName = username + '.' + tld

    if (username.length === 0) {
      this.updateAlert('danger', 'Name must have at least one character')
      return
    }

    const nameHasBeenPreordered = hasNameBeenPreordered(
      domainName, this.props.localIdentities)

      if (nameHasBeenPreordered) {
        this.updateAlert('danger', 'Name has already been preordered')
        this.setState({ registrationLock: false })
      } else {
        let address = this.props.identityAddresses[0]
        //let tokenFileUrl = 'https://blockstack.s3-us-west-1.amazonaws.com/staging/' + domainName + '.json'
        // TODO create blank profile.json on dropbox

        uploadProfile(this.props.api, domainName, "{}", true).then((profileUrl) => {

          const tokenFileUrl = profileUrl
          this.props.registerName(this.props.api, domainName, tokenFileUrl, address)
            this.updateAlert('success', 'Name preordered! Waiting for registration confirmation.')

            //this.context.router.push('/')
          })
        }
        return



        const analyticsId = this.props.analyticsId
        mixpanel.track('Register identity', { distinct_id: analyticsId })
        mixpanel.track('Perform action', { distinct_id: analyticsId })
      }

  render() {
    let tld = this.state.tlds[this.state.type],
        nameLabel = this.state.nameLabels[this.state.type]

    return (
      <div className="body-inner-white">
        <PageHeader title="Register" />
        <div className="container vertical-split-content">
          <div className="col-sm-3">
          </div>
          <div className="col-sm-6">
            { this.state.alerts.map(function(alert, index) {
              return (
                <Alert key={index} message={alert.message} status={alert.status} />
              )
            })}
            <fieldset className="form-group">
              <label className="capitalize">{nameLabel}</label>
              <div className="input-group">
                <input
                  name="username"
                  className="form-control"
                  placeholder={nameLabel}
                  value={this.state.username}
                  onChange={this.onChange} />
                <span className="input-group-addon">.{tld}</span>
              </div>
            </fieldset>
            <div>
              <button className="btn btn-primary" onClick={this.registerIdentity}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage)

/*
          <div>
            <label>Registration Cost</label>
            <div className="highlight">
              <pre>
                <code>
                  {this.state.nameCost} mBTC
                </code>
              </pre>
            </div>
          </div>

<fieldset className="form-group">
  <select name="type" className="c-select"
    defaultValue={this.state.type} onChange={this.onChange}>
    <option value="person">Person</option>
    <option value="organization">Organization</option>
  </select>
</fieldset>
*/
