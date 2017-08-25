import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person } from 'blockstack'
import Modal from 'react-modal'
import Alert from '../components/Alert'
import Image from '../components/Image'
import InputGroup from '../components/InputGroup'
import { IdentityActions } from './store/identity'
import { AccountActions }  from '../account/store/account'
import SocialAccountItem from './components/SocialAccountItem'
import PGPAccountItem from './components/PGPAccountItem'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/DefaultProfilePage.js')

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    namesOwned: state.profiles.identity.namesOwned,
    createProfileError: state.profiles.identity.createProfileError,
    identityAddresses: state.account.identityAccount.addresses,
    nextUnusedAddressIndex: state.account.identityAccount.addressIndex,
    api: state.settings.api,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, IdentityActions, AccountActions), dispatch)
}

class DefaultProfilePage extends Component {
  static propTypes = {
    localIdentities: PropTypes.object.isRequired,
    defaultIdentity: PropTypes.string.isRequired,
    createNewProfile: PropTypes.func.isRequired,
    refreshIdentities: PropTypes.func.isRequired,
    namesOwned: PropTypes.array.isRequired,
    api: PropTypes.object.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    nextUnusedAddressIndex: PropTypes.number.isRequired,
    encryptedBackupPhrase: PropTypes.string.isRequired,
    setDefaultIdentity: PropTypes.func.isRequired,
    resetCreateNewProfileError: PropTypes.func.isRequired,
    createProfileError: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      localIdentities: this.props.localIdentities,
      passwordPromptIsOpen: false,
      processing: false,
      password: ''
    }

    this.onValueChange = this.onValueChange.bind(this)
    this.setDefaultIdentity = this.setDefaultIdentity.bind(this)
    this.createNewProfile = this.createNewProfile.bind(this)
    this.availableIdentityAddresses = this.availableIdentityAddresses.bind(this)
    this.openPasswordPrompt = this.openPasswordPrompt.bind(this)
    this.closePasswordPrompt = this.closePasswordPrompt.bind(this)
  }

  componentWillMount() {
    logger.trace('componentWillMount')
    this.props.refreshIdentities(
      this.props.api,
      this.props.identityAddresses,
      this.props.localIdentities,
      this.props.namesOwned
    )
  }

  componentWillReceiveProps(nextProps) {
    logger.trace('componentWillReceiveProps')
    this.setState({
      localIdentities: nextProps.localIdentities
    })
    if (nextProps.createProfileError) {
      this.setState({
        processing: false
      })
    }

    const currentIdentityCount = Object.keys(this.props.localIdentities).length

    const newIdentityCount = Object.keys(nextProps.localIdentities).length
    if (currentIdentityCount < newIdentityCount) {
      this.setState({
        processing: false,
        password: ''
      })
      this.closePasswordPrompt()
    }
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  setDefaultIdentity(domainName) {
    this.props.setDefaultIdentity(domainName)
  }

  createNewProfile(event) {
    logger.trace('createNewProfile')
    this.setState({
      processing: true
    })
    event.preventDefault()
    const encryptedBackupPhrase = this.props.encryptedBackupPhrase
    const password = this.state.password
    const nextUnusedAddressIndex = this.props.nextUnusedAddressIndex

    this.props.createNewProfile(
      encryptedBackupPhrase,
      password, nextUnusedAddressIndex
    )
  }

  openPasswordPrompt(event) {
    event.preventDefault()
    this.setState({
      processing: false
    })
    this.props.resetCreateNewProfileError()
    this.setState({
      passwordPromptIsOpen: true
    })
  }

  closePasswordPrompt(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({
      passwordPromptIsOpen: false
    })
  }

  availableIdentityAddresses() {
    return this.props.nextUnusedAddressIndex + 1 <= this.props.identityAddresses.length
  }

  render() {
    const createProfileError = this.props.createProfileError
    const passwordPromptIsOpen = this.state.passwordPromptIsOpen
    const defaultIdentityName = this.props.defaultIdentity
    console.log(`defaultIdentity: ${defaultIdentityName}`)
    const identity = this.state.localIdentities[defaultIdentityName]

    // render() sometimes gets called before defaultIdentityName
    // is updated from ownerAddress to the actual name when adding
    // a username.
    if (!identity) {
      return null
    }

    const person = new Person(identity.profile)

    if (identity.ownerAddress === defaultIdentityName) {
      identity.canAddUsername = true
    } else {
      identity.canAddUsername = false
    }

    const domainName = identity.domainName

    const verifications = identity.verifications
    const blockNumber = identity.blockNumber
    const transactionIndex = identity.transactionIndex

    const accounts = person.profile().account || []
    const connections = person.connections() || []


    return (
      <div>
        <Modal
          isOpen={passwordPromptIsOpen}
          onRequestClose={this.closePasswordPrompt}
          contentLabel="Password Modal"
          shouldCloseOnOverlayClick
          style={{ overlay: { zIndex: 10 } }}
          className="container-fluid"
        >
          <form onSubmit={this.createNewProfile}>
            <h3 className="modal-heading">Enter your password to create a new profile</h3>
            <div>
              {createProfileError ?
                <Alert key="1" message="Incorrect password" status="danger" />
                :
                null
              }
            </div>
            <InputGroup
              name="password"
              type="password"
              label=""
              placeholder="Password"
              data={this.state}
              onChange={this.onValueChange}
              required
            />
            <button
              disabled={this.state.processing}
              className="btn btn-primary btn-block"
              type="submit"
            >
              {this.state.processing ?
                <span>Creating...</span>
                :
                <span>Create new profile</span>
              }
            </button>
          </form>
        </Modal>
        <div>
          <div className="container-fluid pro-wrap m-t-50 profile-content-wrapper">
            <div className="col-sm-4">
              <div className="pro-container col-sm-12">
                <div className="pro-avatar m-b-20">
                  <Image
                    src={person.avatarUrl() || ''}
                    fallbackSrc="/images/avatar.png" className="img-circle"
                  />
                </div>
                <div className="">
                  {(blockNumber && transactionIndex) ?
                    <div className="idcard-body dim">
                      Registered in block <span>#{blockNumber}</span>,<br />
                      transaction <span>#{transactionIndex}</span>
                    </div>
                  : null}
                  <h1 className="pro-card-name">{person.name()}</h1>
                  <div className="pro-card-body">
                    {person.description()}
                  </div>
                  {person.address() ?
                    <div className="pro-card-body">
                    {person.address()}
                    </div>
                  : null}
                  {person.birthDate() ?
                    <div className="pro-card-body">
                    {person.birthDate()}
                    </div>
                  : null}
                </div>
              </div>
              <div className="container">
                {connections.length ?
                  <p className="profile-foot">Connections</p>
                : null}
                {connections.map((connection, index) => {
                  if (connection.id) {
                    return (
                      <Link
                        to={`/profiles/blockchain/${connection.id}`}
                        key={index} className="connections"
                      >
                        <Image
                          src={new Person(connection).avatarUrl()}
                          style={{ width: '40px', height: '40px' }}
                        />
                      </Link>
                    )
                  } else {
                    return null
                  }
                })}
              </div>
            </div>
            <div className="col-sm-8 pull-right profile-right-col-fill">
              <div className="profile-right-col">
                <h3>
                  {domainName}
                </h3>
                <ul>
                  {accounts.map((account) => {
                    let verified = false
                    for (let i = 0; i < verifications.length; i++) {
                      const verification = verifications[i]
                      if (verification.service === account.service &&
                        verification.valid === true) {
                        verified = true
                        break
                      }
                    }
                    if (account.service === 'pgp') {
                      return (
                        <PGPAccountItem
                          key={`${account.service}-${account.identifier}`}
                          service={account.service}
                          identifier={account.identifier}
                          contentUrl={account.contentUrl}
                          listItem
                        />
                      )
                    } else {
                      return (
                        <SocialAccountItem
                          key={`${account.service}-${account.identifier}`}
                          service={account.service}
                          identifier={account.identifier}
                          proofUrl={account.proofUrl}
                          listItem
                          verified={verified}
                        />
                      )
                    }
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="container-fluid profile-content-wrapper pro-actions-wrap">
            <div>
              <Link to={`/profiles/${domainName}/edit`}
                className="btn btn-lg btn-primary btn-black btn-inline btn-tight">
                Edit
              </Link>
              {identity.canAddUsername ?
                <button
                  className="btn btn-lg btn-primary btn-black btn-inline btn-tight"
                  disabled={true}
                  title="Add a username to view publicly."
                >
                View Publicly
                </button>
                :
                <span>
                  <Link to={`/profiles/${domainName}`}
                    className="btn btn-lg btn-primary btn-black btn-inline btn-tight">
                    View Publicly
                  </Link>
                  <Link to={`/profiles/${domainName}/zone-file`}
                    className="btn btn-lg btn-primary btn-black btn-inline btn-tight">
                    Advanced
                  </Link>
                </span>
              }
              {identity.canAddUsername ?
                <Link to={`/profiles/i/add-username/${domainName}/search`}
                  className="btn btn-lg btn-primary btn-black btn-inline btn-tight">
                 Add a username
                </Link>
                :
                null
              }
            </div>
          </div>
        </div>
        <div className="card-list-container m-t-30">
          <button
            className="btn btn-electric-blue btn-lg" onClick={this.openPasswordPrompt}
          >
            + Create
          </button>
          <Link
            className="btn btn-electric-blue btn-lg"
            to="/profiles"
            disabled
          >
            Me
          </Link>
          <Link
            className="btn btn-electric-blue btn-lg"
            to="/profiles/i/all"
          >
            All profiles
          </Link>
        </div>
      </div>
    )
  }
}

//   render() {
//     const createProfileError = this.props.createProfileError
//     const passwordPromptIsOpen = this.state.passwordPromptIsOpen
//     const defaultIdentityName = this.props.defaultIdentity
//     const identity = this.state.localIdentities[defaultIdentityName]
//     const person = new Person(identity.profile)
//
//     if (identity.ownerAddress === defaultIdentityName) {
//       identity.canAddUsername = true
//     } else {
//       identity.canAddUsername = false
//     }
//     return (
//       <div className="card-list-container profile-content-wrapper">
//
//         <div>
//           <h5 className="h5-landing">Me</h5>
//         </div>
//         <div className="container card-list-container">
//           <ul className="card-wrapper">
//             <IdentityItem
//               key={identity.domainName}
//               label={identity.domainName}
//               pending={!identity.registered}
//               avatarUrl={person.avatarUrl() || ''}
//               url={`/profiles/${identity.domainName}/local`}
//               ownerAddress={identity.ownerAddress}
//               canAddUsername={identity.canAddUsername}
//               isDefault={identity.domainName === this.props.defaultIdentity}
//               setDefaultIdentity={() => this.setDefaultIdentity(identity.domainName)}
//             />
//           </ul>
//         </div>
//         <div className="card-list-container m-t-30">
//           <button
//             className="btn btn-electric-blue btn-lg" onClick={this.openPasswordPrompt}
//           >
//             + Create
//           </button>
//           <Link
//             className="btn btn-electric-blue btn-lg"
//             to="/profiles"
//             disabled
//           >
//             Me
//           </Link>
//           <Link
//             className="btn btn-electric-blue btn-lg"
//             to="/profiles/i/all"
//           >
//             All profiles
//           </Link>
//         </div>
//       </div>
//     )
//   }
// }

export default connect(mapStateToProps, mapDispatchToProps)(DefaultProfilePage)
