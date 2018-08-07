import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { decryptMnemonic } from 'blockstack'
import AccountActions from '../../../../app/js/account/store/account/actions'
import {
  CREATE_ACCOUNT,
  DELETE_ACCOUNT,
  UPDATE_BACKUP_PHRASE,
  NEW_BITCOIN_ADDRESS,
  RESET_CORE_BALANCE_WITHDRAWAL,
  PROMPTED_FOR_EMAIL,
  CONNECTED_STORAGE,
  VIEWED_RECOVERY_CODE,
  RECOVERY_CODE_VERIFIED,
  INCREMENT_IDENTITY_ADDRESS_INDEX,
  NEW_IDENTITY_ADDRESS,
  WITHDRAW_CORE_BALANCE_ERROR,
  WITHDRAWING_CORE_BALANCE,
  WITHDRAW_CORE_BALANCE_SUCCESS,
  UPDATE_CORE_ADDRESS,
  UPDATE_CORE_BALANCE,
  UPDATE_BALANCES
} from '../../../../app/js/account/store/account/types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('AccountActions', () => {
  describe('createAccount', () => {
    const getBlockchainIdentitiesResult = {
      identityPublicKeychain: 'fakeIdentityPublicKeychain',
      bitcoinPublicKeychain: 'fakeBitcoinPublicKeychain',
      firstBitcoinAddress: 'fakeFirstBitcoinAddress',
      identityAddresses: 'fakeIdentityAddresses',
      identityKeypairs: 'fakeIdentityAddresses'
    }
    const encryptedBackupPhrase = 'fakeEncryptedBackupPhrase'
    const masterKeychain = 'fakeMasterKeychain'
    const identitiesToGenerate = 'fakeIdentitiesToGenerate'
    let action
    let getBlockchainIdentitiesStub

    beforeEach(() => {
      getBlockchainIdentitiesStub = sinon.stub().returns(getBlockchainIdentitiesResult)
      AccountActions.__Rewire__('getBlockchainIdentities', getBlockchainIdentitiesStub)
      action = AccountActions.createAccount(
        encryptedBackupPhrase,
        masterKeychain,
        identitiesToGenerate
      )
    })

    afterEach(() => {
      AccountActions.__ResetDependency__('getBlockchainIdentities')
    })

    describe('gets Blockchain Identities', () => {
      it('based on masterKeychain and identitiesToGenerate passed as params 1 & 2', () => {
          assert.equal(getBlockchainIdentitiesStub.callCount, 1)
          assert.equal(
            getBlockchainIdentitiesStub.calledWith(
              masterKeychain, identitiesToGenerate),
            true
          )
      })

      describe('and returns an object with', () => {
        it('.type CREATE_ACCOUNT', () => {
            assert.equal(action.type, CREATE_ACCOUNT)
        })

        it('.encryptedBackupPhrase == encryptedBackupPhrase passed as param', () => {
            assert.equal(action.encryptedBackupPhrase, encryptedBackupPhrase)
        })

        it('.bitcoinPublicKeychain got from blockchain identities', () => {
            assert.equal(
              action.bitcoinPublicKeychain,
              getBlockchainIdentitiesResult.bitcoinPublicKeychain)
        })

        it('.firstBitcoinAddress got from blockchain identities', () => {
            assert.equal(
              action.firstBitcoinAddress,
              getBlockchainIdentitiesResult.firstBitcoinAddress)
        })

        it('.identityAddresses got from blockchain identities', () => {
            assert.equal(
              action.identityAddresses,
              getBlockchainIdentitiesResult.identityAddresses)
        })

        it('.identityKeypairs got from blockchain identities', () => {
            assert.equal(
              action.identityKeypairs,
              getBlockchainIdentitiesResult.identityKeypairs)
        })
      })
    })
  })

  describe('updateBackupPhrase', () => {
    const encryptedBackupPhrase = 'fakeEncryptedBackupPhrase'
    const action = AccountActions.updateBackupPhrase(encryptedBackupPhrase)

    it('returns .type UPDATE_BACKUP_PHRASE', () => {
      assert.equal(action.type, UPDATE_BACKUP_PHRASE)
    })

    it('returns .encryptedBackupPhrase set by 1st param', () => {
      assert.equal(action.encryptedBackupPhrase, encryptedBackupPhrase)
    })
  })

  describe('initializeWallet', () => {
    it('creates an new account with a new master keychain', () => {
      const store = mockStore({})
      const password = 'password'

      return store
        .dispatch(AccountActions.initializeWallet(password))
        .then(() => {
          const actions = store.getActions()

          assert.equal(actions.length, 1)
          assert.equal(actions[0].type, CREATE_ACCOUNT)
        })
    })

    it('restores an existing wallet and keychain', () => {
      const store = mockStore({})
      const password = 'password'
      const backupPhrase =
        'sound idle panel often situate develop unit text design antenna ' +
        'vendor screen opinion balcony share trigger accuse scatter visa uniform brass ' +
        'update opinion media'
      const bitcoinPublicKeychain =
        'xpub6Br2scNTh9Luk2VPebfEvjbWWC5WhvxpxgK8ap2qhYTS4xvZu' +
        '8Y3G1npmx8DdvwUdCbtNb7qNLyTChKMbY8dThLV5Zvdq9AojQjxrM6gTC8'
      const identityPublicKeychain =
        'xpub6B6tCCb8T5eXUKVYUoppmSi5KhNRboRJUwqHavxdvQTncfmB' +
        'NFCX4Nq9w8DsfuS6AYPpBYRuS3dcUuyF8mQtwEydAEN3A4Cx6HDy58jpKEb'
      const firstBitcoinAddress = '112FogMTesWmLzkWbtKrSg3p9LK6Lucn4s'
      const identityAddresses = ['1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk']

      const identityKeypairs = [
        {
          key:
            'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
          keyID:
            '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
          address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
          appsNodeKey:
            'xprvA1y4zBndD83n6PWgVH6ivkTpNQ2WU1UGPg9hWa2q8sCANa7YrYMZFHWMhrbpsarx' +
            'XMuQRa4jtaT2YXugwsKrjFgn765tUHu9XjyiDFEjB7f',
          salt:
            'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e'
        }
      ]

      return store
        .dispatch(AccountActions.initializeWallet(password, backupPhrase))
        .then(() => {
          const actions = store.getActions()

          assert.equal(actions.length, 1)
          assert.equal(actions[0].bitcoinPublicKeychain, bitcoinPublicKeychain)
          assert.equal(
            actions[0].identityPublicKeychain,
            identityPublicKeychain
          )
          assert.equal(actions[0].firstBitcoinAddress, firstBitcoinAddress)
          assert.deepEqual(actions[0].identityAddresses, identityAddresses)
          assert.deepEqual(actions[0].identityKeypairs, identityKeypairs)
        })
    })

    it('generates and restores the same wallet', () => {
      const store1 = mockStore({})
      const password = 'password'

      return store1
        .dispatch(AccountActions.initializeWallet(password))
        .then(() => {
          const actions1 = store1.getActions()

          assert.equal(actions1.length, 1)
          assert.equal(actions1[0].type, CREATE_ACCOUNT)

          const encryptedBackupPhrase = actions1[0].encryptedBackupPhrase
          const identityPublicKeychain = actions1[0].identityPublicKeychain
          const bitcoinPublicKeychain = actions1[0].bitcoinPublicKeychain

          return decryptMnemonic(
            new Buffer(encryptedBackupPhrase, 'hex'),
            password
          ).then(plaintextBuffer => {
            const backupPhrase = plaintextBuffer.toString()
            const store2 = mockStore({})

            return store2
              .dispatch(AccountActions.initializeWallet(password, backupPhrase))
              .then(() => {
                const actions2 = store2.getActions()

                assert.equal(actions2.length, 1)
                assert.equal(actions2[0].type, CREATE_ACCOUNT)
                assert.equal(
                  actions2[0].identityPublicKeychain,
                  identityPublicKeychain
                )
                assert.equal(
                  actions2[0].bitcoinPublicKeychain,
                  bitcoinPublicKeychain
                )
              })
          })
        })
    })
  })

  describe('newBitcoinAddress', () => {
    const action = AccountActions.newBitcoinAddress()

    it('returns .type NEW_BITCOIN_ADDRESS', () => {
      assert.equal(action.type, NEW_BITCOIN_ADDRESS)
    })
  })

  describe('deleteAccount', () => {
    const action = AccountActions.deleteAccount()

    it('returns .type DELETE_ACCOUNT', () => {
      assert.equal(action.type, DELETE_ACCOUNT)
    })

    it('returns .encryptedBackupPhrase set to null', () => {
      assert.equal(action.encryptedBackupPhrase, null)
    })

    it('returns .accountCreated set to false', () => {
      assert.equal(action.accountCreated, false)
    })
  })

  describe('refreshBalances', () => {
    describe('for each address provided as second param', () => {
      const insightUrl = 'fakeInsightUrl'
      const address = 'fakeAddresses'
      const addresses = [address]
      const coreAPIPassword = 'fakeCoreAPIPassword'
      const getInsightUrlsResult = {
        base: 'fakeBase',
        confirmedBalanceUrl: 'fakeBase/balance/c',
        unconfirmedBalanceUrl: 'fakeBase/balance/u'
      }
      let action
      const callAction = () => {
        action = AccountActions.refreshBalances(
          insightUrl,
          addresses,
          coreAPIPassword
        )
      }

      beforeEach(() => {
        const getInsightUrlsStub = sinon.stub().returns(getInsightUrlsResult)
        AccountActions.__Rewire__('getInsightUrls', getInsightUrlsStub)
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('getInsightUrls')
      })

      describe('fetches confirmedBalanceUrl', () => {
        describe('and when failing', () => {
          const error = new Error()
          const loggerMock = {
            debug: sinon.spy(),
            error: sinon.spy()
          }

          beforeEach(() => {
            sinon.stub(global, 'fetch').rejects(error)

            AccountActions.__Rewire__('logger', loggerMock)
            callAction()
          })

          afterEach(() => {
            sinon.restore(global, 'fetch')
            AccountActions.__ResetDependency__('logger')
          })

          it('logs an expressive error', () => {
            const store = mockStore({})

            return store.dispatch(action)
              .then(() => {
                assert.deepEqual(loggerMock.error.firstCall.args, [
                  `refreshBalances: error fetching ${address} confirmed balance`,
                  error
                ])
              })
          })
        })

        describe('and when working', () => {
          let fetchStub

          describe('retrieves confirmedBalance from response', () => {
            const confirmedBalance = 110000000
            const response = {
              text: sinon.stub().returns(`${confirmedBalance}`)
            }

            beforeEach(() => {
              fetchStub = sinon.stub(global, 'fetch')
              fetchStub
                .withArgs(getInsightUrlsResult.confirmedBalanceUrl)
                .resolves(response)
            })

            afterEach(() => {
              sinon.restore(global, 'fetch')
            })

            describe(', then fetches unconfirmedBalanceUrl', () => {
              describe('and when failing', () => {
                const error = new Error()
                const loggerMock = {
                  debug: sinon.spy(),
                  error: sinon.spy()
                }

                beforeEach(() => {
                  fetchStub
                    .withArgs(getInsightUrlsResult.unconfirmedBalanceUrl)
                    .rejects(error)
                  AccountActions.__Rewire__('logger', loggerMock)
                  callAction()
                })

                afterEach(() => {
                  sinon.restore(global, 'fetch')
                  AccountActions.__ResetDependency__('logger')
                })

                it('logs an expressive error', () => {
                  const store = mockStore({})

                  return store.dispatch(action)
                    .then(() => {
                      assert.deepEqual(loggerMock.error.firstCall.args, [
                        `refreshBalances: error fetching ${address} unconfirmed balance`,
                        error
                      ])
                    })
                })
              })

              describe('and when working', () => {
                describe('retrieves unconfirmedBalance from response', () => {
                  const unconfirmedBalance = 1
                  const response2 = {
                    text: sinon.stub().returns(`${unconfirmedBalance}`)
                  }

                  beforeEach(() => {
                    fetchStub
                      .withArgs(getInsightUrlsResult.unconfirmedBalanceUrl)
                      .resolves(response2)
                  })

                  afterEach(() => {
                    sinon.restore(global, 'fetch')
                  })

                  describe('and when done with all addresses', () => {
                    const addresses2 = [
                      'fakeAddress1',
                      'fakeAddress2',
                      'fakeAddress3'
                    ]
                    const confirmedBalances = [
                      199999999,
                      299999999,
                      399999999
                    ]
                    const unconfirmedBalances = [
                      1,
                      2,
                      3
                    ]

                    beforeEach(() => {
                      sinon.restore(global, 'fetch')
                      const fetchStub2 = sinon.stub(global, 'fetch')
                      const fetchStub2C = fetchStub2
                        .withArgs(getInsightUrlsResult.confirmedBalanceUrl)
                      const fetchStub2U = fetchStub2
                        .withArgs(getInsightUrlsResult.unconfirmedBalanceUrl)
                      confirmedBalances.forEach((el, i) =>
                        fetchStub2C.onCall(i).resolves({text: () => `${el}`})
                      )
                      unconfirmedBalances.forEach((el, i) =>
                        fetchStub2U.onCall(i).resolves({text: () => `${el}`})
                      )
                    })

                    afterEach(() => {
                      sinon.restore(global, 'fetch')
                    })

                    describe('dispatches updateBalances action', () => {
                      const satoshisToBtc = s => s / 100000000

                      it('with { addressN: unconfirmedBalanceN + confirmedBalanceN..., total: }', () => {
                        const store = mockStore({})

                        return store.dispatch(
                          AccountActions.refreshBalances(
                            insightUrl,
                            addresses2,
                            coreAPIPassword
                          )
                        ).then(() => {
                          const balances = {}
                          let total = .0
                          addresses2.forEach((el, i) => {
                            balances[el] = satoshisToBtc(
                              confirmedBalances[i] + unconfirmedBalances[i])
                            total += balances[el]
                          })
                          balances.total = total
                          assert.deepEqual(store.getActions()[0], {
                            type: UPDATE_BALANCES,
                            balances
                          })
                        })
                      })

                      describe('if has duplicate addresses', () => {
                        const duplicateAddresses = ['address1', 'address1', 'address2']
                        const loggerMock = {
                          debug: sinon.spy(),
                          error: sinon.spy()
                        }

                        beforeEach(() => {
                          AccountActions.__Rewire__('logger', loggerMock)
                          action = AccountActions.refreshBalances(
                            insightUrl,
                            duplicateAddresses,
                            coreAPIPassword
                          )
                        })

                        afterEach(() => {
                          AccountActions.__ResetDependency__('logger')
                        })

                        it('logs an expressive error', () => {
                          const store = mockStore({})

                          return store.dispatch(action)
                            .then(() => {
                              assert.deepEqual(loggerMock.error.firstCall.args, [
                                `refreshBalances: Duplicate address ${duplicateAddresses[0]} in addresses array`
                              ])
                            })
                        })

                        it('only takes first occurrence of address into account', () => {
                          const store = mockStore({})

                          return store.dispatch(
                            AccountActions.refreshBalances(
                              insightUrl,
                              duplicateAddresses,
                              coreAPIPassword
                            )
                          ).then(() => {
                            const balances = {}
                            balances[duplicateAddresses[0]] = satoshisToBtc(
                              confirmedBalances[0] + unconfirmedBalances[0])
                            balances[duplicateAddresses[2]] = satoshisToBtc(
                              confirmedBalances[2] + unconfirmedBalances[2])
                            balances.total = balances[duplicateAddresses[0]] +
                              balances[duplicateAddresses[2]]
                            assert.deepEqual(store.getActions()[0], {
                              type: UPDATE_BALANCES,
                              balances
                            })

                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  describe('getCoreWalletAddress', () => {
    const loggerMock = {
      error: sinon.spy()
    }
    const walletPaymentAddressUrl = 'fakeWalletPaymentAddressUrl'
    const coreAPIPassword = 'fakeCoreAPIPassword'

    let action

    beforeEach(() => {
      AccountActions.__Rewire__('logger', loggerMock)
      action = AccountActions.getCoreWalletAddress(
        walletPaymentAddressUrl,
        coreAPIPassword
      )
    })

    afterEach(() => {
      AccountActions.__ResetDependency__('logger')
    })

    describe('when isCoreEndpointDisabled', () => {
      beforeEach(() => {
        AccountActions.__Rewire__('isCoreEndpointDisabled',
          sinon.stub().withArgs(walletPaymentAddressUrl).returns(true)
        )
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('isCoreEndpointDisabled')
      })

      it('logs an expressive error and does nothing', () => {
        const store = mockStore({})

        return store.dispatch(action)
          .then(() => {
            assert.deepEqual(loggerMock.error.firstCall.args, [
              'Cannot use core wallet if core is disable'
            ])
            assert.equal(store.getActions().length, 0)
          })
      })
    })

    describe('when not isCoreEndpointDisabled', () => {
      beforeEach(() => {
        AccountActions.__Rewire__('isCoreEndpointDisabled',
          sinon.stub().withArgs(walletPaymentAddressUrl).returns(false)
        )
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('isCoreEndpointDisabled')
      })

      describe('fetches walletPaymentAddressUrl with authorizationHeader', () => {
        const authorizationHeaderValueResult = 'fakeAuthorizationHeaderValue'
        const fetchArgs = [
          walletPaymentAddressUrl,
          { headers: { Authorization: authorizationHeaderValueResult } }
        ]
        let fetchStub

        beforeEach(() => {
          AccountActions.__Rewire__('authorizationHeaderValue',
            sinon.stub().withArgs(coreAPIPassword).returns(authorizationHeaderValueResult))
          fetchStub = sinon.stub(global, 'fetch').withArgs(...fetchArgs)
        })

        afterEach(() => {
          AccountActions.__ResetDependency__('authorizationHeaderValue')
          sinon.restore(global, 'fetch')

        })

        describe('and when failing', () => {
          const error = new Error()

          beforeEach(() => {
            fetchStub.rejects(error)
          })

          it('logs an expressive error and does nothing', () => {
            const store = mockStore({})

            return store.dispatch(action)
              .catch(() => {
                assert.deepEqual(loggerMock.error.firstCall.args, [
                  'getCoreWalletAddress: error fetching address',
                  error
                ])
                assert.equal(store.getActions().length, 0)
              })
          })
        })

        describe('and when working', () => {
          const address = 'fakeAddress'
          const jsonAddressTxt = JSON.stringify({ address })

          beforeEach(() => {
            fetchStub.resolves({text: () => jsonAddressTxt})
          })

          describe('parses address from response', () => {
            it('and dispatches updateCoreWalletAddress with address', () => {
              const store = mockStore({})

              return store.dispatch(action)
                .then(() => {
                  assert.deepEqual(store.getActions()[0], {
                    type: UPDATE_CORE_ADDRESS,
                    coreWalletAddress: address
                  })
                })
            })
          })
        })
      })
    })
  })

  describe('refreshCoreWalletBalance', () => {
    let loggerMock
    const addressBalanceUrl = 'fakeAddressBalanceUrl'
    const coreAPIPassword = 'fakeCoreAPIPassword'

    let action

    beforeEach(() => {
      loggerMock = {
        debug: sinon.spy(),
        error: sinon.spy(),
        trace: sinon.spy()
      }
      AccountActions.__Rewire__('logger', loggerMock)
      action = AccountActions.refreshCoreWalletBalance(
        addressBalanceUrl,
        coreAPIPassword
      )
    })

    afterEach(() => {
      AccountActions.__ResetDependency__('logger')
    })

    describe('when isCoreEndpointDisabled', () => {
      beforeEach(() => {
        AccountActions.__Rewire__('isCoreEndpointDisabled',
          sinon.stub().withArgs(addressBalanceUrl).returns(true)
        )
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('isCoreEndpointDisabled')
      })

      it('logs an expressive debug message', () => {
        const store = mockStore({})

        return store.dispatch(action)
          .then(() => {
            assert.deepEqual(loggerMock.debug.firstCall.args, [
              'Mocking core wallet balance in webapp build'
            ])
          })
      })

      it('dispatches updateCoreWalletBalance(0)', () => {
        const store = mockStore({})

        return store.dispatch(action)
          .then(() => {
            assert.deepEqual(store.getActions()[0], {
              type: UPDATE_CORE_BALANCE,
              coreWalletBalance: 0
            })
          })
      })
    })

    describe('when not isCoreEndpointDisabled', () => {
      beforeEach(() => {
        AccountActions.__Rewire__('isCoreEndpointDisabled',
          sinon.stub().withArgs(addressBalanceUrl).returns(false)
        )
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('isCoreEndpointDisabled')
      })

      describe('fetches addressBalanceUrl with authorizationHeader', () => {
        const authorizationHeaderValueResult = 'fakeAuthorizationHeaderValue'
        const fetchArgs = [
          addressBalanceUrl,
          { headers: { Authorization: authorizationHeaderValueResult } }
        ]
        let fetchStub

        beforeEach(() => {
          AccountActions.__Rewire__('authorizationHeaderValue',
            sinon.stub().withArgs(coreAPIPassword).returns(authorizationHeaderValueResult))
          fetchStub = sinon.stub(global, 'fetch').withArgs(...fetchArgs)
        })

        afterEach(() => {
          AccountActions.__ResetDependency__('authorizationHeaderValue')
          sinon.restore(global, 'fetch')

        })

        describe('and even before failing', () => {
          beforeEach(() => {
            fetchStub.rejects()
          })

          it('logs a trace message', () => {
            const store = mockStore({})

            return store.dispatch(action)
              .catch(() => {
                assert.deepEqual(loggerMock.trace.firstCall.args, [
                  'refreshCoreWalletBalance: Beginning refresh...'
                ])
              })
          })

          it('logs a debug message', () => {
            const store = mockStore({})

            return store.dispatch(action)
              .catch(() => {
                assert.deepEqual(loggerMock.debug.firstCall.args, [
                  `refreshCoreWalletBalance: addressBalanceUrl: ${addressBalanceUrl}`
                ])
              })
          })
        })

        describe('and when failing', () => {
          const error = new Error()

          beforeEach(() => {
            fetchStub.rejects(error)
          })

          it('logs an expressive error and does nothing', () => {
            const store = mockStore({})

            return store.dispatch(action)
              .catch(() => {
                assert.deepEqual(loggerMock.error.firstCall.args, [
                  'refreshCoreWalletBalance: error refreshing balance',
                  error
                ])
                assert.equal(store.getActions().length, 0)
              })
          })
        })

        describe('and when working', () => {
          const bitcoin = 'fakeAddress'
          const jsonBitcoinBalanceTxt = JSON.stringify({ balance: { bitcoin } })

          beforeEach(() => {
            fetchStub.resolves({text: () => jsonBitcoinBalanceTxt})
          })

          describe('parses bitcoin balance from response', () => {
            it('logs a debug message with bitcoin balance', () => {
              const store = mockStore({})

              return store.dispatch(action)
                .catch(() => {
                  assert.deepEqual(loggerMock.debug.lastCall.args, [
                    `refreshCoreWalletBalance: balance is ${bitcoin}.`
                  ])
                })
            })

            it('and dispatches updateCoreWalletBalance with address', () => {
              const store = mockStore({})

              return store.dispatch(action)
                .catch(() => {
                  assert.deepEqual(store.getActions()[0], {
                    type: UPDATE_CORE_BALANCE,
                    coreWalletBalance: bitcoin
                  })
                })
            })
          })
        })
      })
    })
  })

  describe('resetCoreWithdrawal', () => {
    describe('dispatches an action', () => {
      let action

      beforeEach(() => {
        action = AccountActions.resetCoreWithdrawal()
      })

      it('with .type  RESET_CORE_BALANCE_WITHDRAWAL', () => {
        const store = mockStore({})

        store.dispatch(action)
        assert.deepEqual(store.getActions()[0], {
          type: RESET_CORE_BALANCE_WITHDRAWAL
        })
      })
    })
  })

  describe('withdrawBitcoinClientSide', () => {
    const paymentKey = 'fakePaymentKey'
    const recipientAddress = 'fakeRecipientAddress'
    const amountBTC = 1
    const amountSatoshis = amountBTC * 1e8
    const defaultRegTestMode = false
    const configMock = {}
    const networkMock = {
      defaults: {
        LOCAL_REGTEST: {
          coerceAddress: sinon.stub().returns('coercedRecipientAddress'),
          broadcastTransaction: sinon.spy()
        }
      }
    }
    const callAction = (regTestMode = defaultRegTestMode) =>
      AccountActions.withdrawBitcoinClientSide(
        regTestMode,
        paymentKey,
        recipientAddress,
        amountBTC
      )
    let loggerMock
    let store
    let action

    beforeEach(() => {
      loggerMock = {
        trace: sinon.spy(),
        error: sinon.spy()
      }
      AccountActions.__Rewire__('logger', loggerMock)
      store = mockStore({})
      AccountActions.__Rewire__('config', configMock)
      AccountActions.__Rewire__('network', networkMock)
    })

    afterEach(() => {
      AccountActions.__ResetDependency__('logger')
      AccountActions.__ResetDependency__('config')
      AccountActions.__ResetDependency__('network')
    })

    describe('when regTestMode', () => {
      beforeEach(() => {
        AccountActions.__Rewire__('transactions', {
          makeBitcoinSpend: sinon.stub().rejects(new Error())
        })
        action = callAction(true)
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('transactions')
      })

      it('logs a trace message', () =>
        store.dispatch(action)
          .then(() => {
            assert.deepEqual(loggerMock.trace.firstCall.args, [
              'Using regtest network'
            ])
          })
      )

      it('sets config.network to LOCAL_REGTEST', () =>
        store.dispatch(action)
          .then(() => {
            assert.equal(configMock.network, networkMock.defaults.LOCAL_REGTEST)
          })
      )

      it('sets blockstackAPIUrl to http://localhost:6270', () =>
        store.dispatch(action)
          .then(() => {
            assert.equal(configMock.network.blockstackAPIUrl, 'http://localhost:6270')
          })
      )
    })

    describe('dispatches withdrawingCoreBalance', () => {
      beforeEach(() => {
        AccountActions.__Rewire__('transactions', {
          makeBitcoinSpend: sinon.stub().rejects(new Error())
        })
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('transactions')
      })

      describe('(when no regTestMode)', () => {
        beforeEach(() => {
          action = callAction(false)
        })

        it('with recipientAddress and amountBTC', () =>
          store.dispatch(action)
            .then(() => {
              assert.deepEqual(store.getActions()[0], {
                type: WITHDRAWING_CORE_BALANCE,
                recipientAddress
              })
            })
        )
      })

      describe('(when regTestMode)', () => {
        beforeEach(() => {
          configMock.network = networkMock.defaults.LOCAL_REGTEST
          configMock.network.blockstackAPIUrl = 'http://localhost:6270'
          action = callAction(true)
        })

        it('with coerced recipientAddress and amountBTC', () =>
          store.dispatch(action)
            .then(() => {
              assert.deepEqual(store.getActions()[0], {
                type: WITHDRAWING_CORE_BALANCE,
                recipientAddress: configMock.network.coerceAddress(recipientAddress)
              })
            })
        )
      })
    })

    describe('makes a bitcoin spending transaction', () => {
      describe('(when no regTestMode)', () => {
        const makeBitcoinSpendStub = sinon.stub()
          .withArgs(recipientAddress, paymentKey, amountSatoshis)
          .rejects(new Error())

        beforeEach(() => {
          AccountActions.__Rewire__('transactions', {
            makeBitcoinSpend: makeBitcoinSpendStub
          })
          action = callAction(false)
        })

        afterEach(() => {
          AccountActions.__ResetDependency__('transactions')
        })

        it('with recipientAddress, paymentKey, amountSatoshis', () =>
          store.dispatch(action)
            .then(() => {
              assert.deepEqual(makeBitcoinSpendStub.firstCall.args,
                [recipientAddress, paymentKey, amountSatoshis])
            })
        )
      })

      describe('(when regTestMode)', () => {
        let makeBitcoinSpendStub
        let coercedRecipientAddress

        beforeEach(() => {
          configMock.network = networkMock.defaults.LOCAL_REGTEST
          configMock.network.blockstackAPIUrl = 'http://localhost:6270'
          coercedRecipientAddress = configMock.network.coerceAddress(recipientAddress)
          makeBitcoinSpendStub = sinon.stub()
            .withArgs(coercedRecipientAddress, paymentKey, amountSatoshis)
            .rejects(new Error())
          AccountActions.__Rewire__('transactions', {
            makeBitcoinSpend: makeBitcoinSpendStub
          })
          action = callAction(true)
        })

        afterEach(() => {
          AccountActions.__ResetDependency__('transactions')
        })

        it('with coerced recipientAddress and amountBTC', () =>
          store.dispatch(action)
            .then(() => {
              assert.deepEqual(makeBitcoinSpendStub.firstCall.args,
                [coercedRecipientAddress, paymentKey, amountSatoshis])
            })
        )
      })

      describe('when failing', () => {
        const error = new Error()
        const makeBitcoinSpendStub = sinon.stub()
          .withArgs(recipientAddress, paymentKey, amountSatoshis)
          .rejects(error)
        beforeEach(() => {
          AccountActions.__Rewire__('transactions', {
            makeBitcoinSpend: makeBitcoinSpendStub
          })
          action = callAction(false)
        })

        afterEach(() => {
          AccountActions.__ResetDependency__('transactions')
        })

        it('logs an expressive error', () =>
          store.dispatch(action)
            .then(() => {
              assert.deepEqual(loggerMock.error.firstCall.args, [
                'withdrawBitcoinClientSide: error generating and broadcasting',
                error
              ])
            })
        )

        it('dispatches withdrawCoreBalanceError with error', () =>
          store.dispatch(action)
            .then(() => {
              assert.deepEqual(store.getActions()[1], {
                type: WITHDRAW_CORE_BALANCE_ERROR,
                error
              })
            })
        )
      })

      describe('when working', () => {
        const transactionHex = 'fakeTransactionhex'
        const makeBitcoinSpendStub = sinon.stub()
          .withArgs(recipientAddress, paymentKey, amountSatoshis)
          .resolves(transactionHex)

        beforeEach(() => {
          AccountActions.__Rewire__('transactions', {
            makeBitcoinSpend: makeBitcoinSpendStub
          })
        })

        afterEach(() => {
          AccountActions.__ResetDependency__('transactions')
        })

        describe('broadcasts the transactionHex', () => {
          beforeEach(() => {
            action = callAction(false)
          })

          it('after logging a trace message with the transactionHex', () =>
            store.dispatch(action)
              .then(() => {
                assert.deepEqual(loggerMock.trace.lastCall.args, [
                  `Broadcast btc spend with tx hex: ${transactionHex}`
                ])
              })
          )

          it('to the config.network via .broadcastTransaction', () =>
            store.dispatch(action)
              .then(() => {
                assert.deepEqual(
                  networkMock.defaults.LOCAL_REGTEST.broadcastTransaction.lastCall.args,
                  [ transactionHex ]
                )
              })
          )
        })

        describe('dispatches withdrawCoreBalanceSuccess action', () => {
          beforeEach(() => {
            action = callAction(false)
          })

          it('to signal success', () =>
            store.dispatch(action)
              .then(() => {
                assert.deepEqual(store.getActions()[1], {
                  type: WITHDRAW_CORE_BALANCE_SUCCESS
                })
              })
          )
        })
      })
    })
  })

  describe('withdrawBitcoinFromCoreWallet', () => {
    const coreWalletWithdrawUrl = 'fakeCoreWalletWithdrawUrl'
    const recipientAddress = 'fakeRecipientAddress'
    const coreAPIPassword = 'fakeCoreAPIPassword'
    let store
    let action
    let loggerMock

    beforeEach(() => {
      store = mockStore({})
      loggerMock = {
        debug: sinon.spy(),
        error: sinon.spy(),
        trace: sinon.spy()
      }
      AccountActions.__Rewire__('logger', loggerMock)
      action = AccountActions.withdrawBitcoinFromCoreWallet(
        coreWalletWithdrawUrl,
        recipientAddress,
        coreAPIPassword
      )
    })

    afterEach(() => {
      AccountActions.__ResetDependency__('logger')
    })

    describe('when isCoreEndpointDisabled', () => {
      beforeEach(() => {
        AccountActions.__Rewire__('isCoreEndpointDisabled',
          sinon.stub().withArgs(coreWalletWithdrawUrl).returns(true)
        )
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('isCoreEndpointDisabled')
      })

      describe('dispatches withdrawCoreBalanceError', () => {
        it('with type WITHDRAW_CORE_BALANCE_ERROR', () =>
          store.dispatch(action)
            .then(() => {
              assert.equal(store.getActions()[0].type, WITHDRAW_CORE_BALANCE_ERROR)
            })
        )

        it('with an expressive .error', () =>
          store.dispatch(action)
            .then(() => {
              assert.equal(store.getActions()[0].error,
                'Core wallet withdrawls not allowed in the simple webapp build'
              )
            })
        )

        it('and stops', () =>
          store.dispatch(action)
            .then(() => {
              assert.equal(store.getActions().length, 1)
            })
        )
      })
    })

    describe('when not isCoreEndpointDisabled', () => {
      beforeEach(() => {
        AccountActions.__Rewire__('isCoreEndpointDisabled',
          sinon.stub().withArgs(coreWalletWithdrawUrl).returns(false)
        )
        sinon.stub(global, 'fetch').rejects(new Error())
      })

      afterEach(() => {
        AccountActions.__ResetDependency__('isCoreEndpointDisabled')
        sinon.restore(global, 'fetch')
      })

      describe('when amount is not defined', () => {
        describe('dispatches a withdrawingCoreBalance action', () => {
          it('with type WITHDRAWING_CORE_BALANCE', () =>
            store.dispatch(action)
              .catch(() => {
                assert.equal(store.getActions()[0].type, WITHDRAWING_CORE_BALANCE)
              })
          )

          it('with .recipientAddress', () =>
            store.dispatch(action)
              .catch(() => {
                assert.equal(store.getActions()[0].recipientAddress, recipientAddress)
              })
          )

          describe('called with', () => {
            let stub

            beforeEach(() => {
              stub = sinon.stub().returns({type: ''})
              AccountActions.__Rewire__('withdrawingCoreBalance', stub)
            })

            afterEach(() =>
              AccountActions.__ResetDependency__('withdrawingCoreBalance')
            )

            it('1 as second parameter', () =>
              store.dispatch(action)
                .catch(() => {
                  assert.equal(stub.firstCall.args[1], 1)
                })
            )
          })
        })

        it('logs a debug message with recipientAddress', () =>
          store.dispatch(action)
            .catch(() => {
              assert.deepEqual(loggerMock.debug.firstCall.args, [
                `withdrawBitcoinFromCoreWallet: send all money to ${recipientAddress}`
              ])
            })
        )
      })

      describe('when amount is defined', () => {
        const amountBTC = 1
        const btcToSatoshis = btc => btc * 1e8
        const roundTo = x => Math.round(x)
        const roundedSatoshiAmount = roundTo(btcToSatoshis(amountBTC))

        beforeEach(() => {
          action = AccountActions.withdrawBitcoinFromCoreWallet(
            coreWalletWithdrawUrl,
            recipientAddress,
            coreAPIPassword,
            amountBTC
          )
        })

        it('logs a debug message with roundedSatoshiAmount and recipientAddress', () =>
          store.dispatch(action)
            .catch(() => {
              assert.deepEqual(loggerMock.debug.firstCall.args, [
                `withdrawBitcoinFromCoreWallet: ${roundedSatoshiAmount} to ${recipientAddress}`
              ])
            })
        )

        describe('dispatches a withdrawingCoreBalance action', () => {
          it('with type WITHDRAWING_CORE_BALANCE', () =>
            store.dispatch(action)
              .catch(() => {
                assert.equal(store.getActions()[0].type, WITHDRAWING_CORE_BALANCE)
              })
          )

          it('with .recipientAddress', () =>
            store.dispatch(action)
              .catch(() => {
                assert.equal(store.getActions()[0].recipientAddress, recipientAddress)
              })
          )

          describe('called with', () => {
            let stub

            beforeEach(() => {
              stub = sinon.stub().returns({type: ''})
              AccountActions.__Rewire__('withdrawingCoreBalance', stub)
            })

            afterEach(() =>
              AccountActions.__ResetDependency__('withdrawingCoreBalance')
            )

            it('amount as second parameter', () =>
              store.dispatch(action)
                .catch(() => {
                  assert.equal(stub.firstCall.args[1], amountBTC)
                })
            )
          })
        })
      })

      describe('when paymentKey is not defined', () => {
        it('logs a debug message stating No payment key', () =>
          store.dispatch(action)
            .catch(() => {
              assert.deepEqual(loggerMock.debug.secondCall.args, [
                'withdrawBitcoinFromCoreWallet: No payment key, using core wallet'
              ])
            })
        )
      })

      describe('when paymentKey is defined', () => {
        const paymentKey = 'fakePaymentKey'

        beforeEach(() => {
          action = AccountActions.withdrawBitcoinFromCoreWallet(
            coreWalletWithdrawUrl,
            recipientAddress,
            coreAPIPassword,
            null,
            paymentKey
          )
        })

        it('logs a debug message stating Using provided payment key', () =>
          store.dispatch(action)
            .catch(() => {
              assert.deepEqual(loggerMock.debug.secondCall.args, [
                'withdrawBitcoinFromCoreWallet: Using provided payment key'
              ])
            })
        )
      })

      describe('fetches coreWalletWithdrawUrl', () => {
        it('as provided as first param', () =>
          store.dispatch(action)
            .catch(() => {
              assert.equal(global.fetch.firstCall.args[0], coreWalletWithdrawUrl)
            })
        )

        it('with method POST', () =>
          store.dispatch(action)
            .catch(() => {
              assert.equal(global.fetch.firstCall.args[1].method, 'POST')
            })
        )

        describe('with headers', () => {
          it('Accept: application/json', () =>
            store.dispatch(action)
              .catch(() => {
                assert.equal(global.fetch.firstCall.args[1].headers.Accept, 'application/json')
              })
          )

          it('Content-Type: application/json', () =>
            store.dispatch(action)
              .catch(() => {
                assert.equal(global.fetch.firstCall.args[1].headers['Content-Type'], 'application/json')
              })
          )

          describe('Authorization: ', () => {
            const authorizationHeaderValueResult = 'fakeAuthorizationHeaderValue'

            beforeEach(() => {
              AccountActions.__Rewire__('authorizationHeaderValue',
                sinon.stub().withArgs(coreAPIPassword).returns(authorizationHeaderValueResult))
            })

            afterEach(() => {
              AccountActions.__ResetDependency__('authorizationHeaderValue')
            })

            it('authorizationHeaderValue(coreAPIPassword)', () =>
              store.dispatch(action)
                .catch(() => {
                  assert.equal(
                    global.fetch.firstCall.args[1].headers.Authorization,
                    authorizationHeaderValueResult)
                })
            )
          })
        })

        describe('with body', () => {
          const getBody = () => JSON.parse(global.fetch.firstCall.args[1].body)

          it('with address: recipientAddress', () =>
            store.dispatch(action)
              .catch(() => assert.equal(getBody().address, recipientAddress))

          )

          it('with min_confs: 0', () =>
            store.dispatch(action)
              .catch(() => assert.equal(getBody().min_confs, 0))

          )

          describe('with amount', () => {
            describe('when amount is not defined', () => {
              it('undefined', () =>
                store.dispatch(action)
                  .catch(() => assert.equal(getBody().amount, undefined))

              )
            })

            describe('when amount is defined', () => {
              const amount = 1

              beforeEach(() => {
                action = AccountActions.withdrawBitcoinFromCoreWallet(
                  coreWalletWithdrawUrl,
                  recipientAddress,
                  coreAPIPassword,
                  amount
                )
              })

              it('== amount provided as param', () =>
                store.dispatch(action)
                  .catch(() => assert.equal(getBody().amount, amount))

              )
            })
          })

          describe('with paymentKey', () => {
            describe('when paymentKey is not defined', () => {
              it('undefined', () =>
                store.dispatch(action)
                  .catch(() => assert.equal(getBody().paymentKey, undefined))

              )
            })

            describe('when paymentKey is defined', () => {
              const paymentKey = 'fakePaymentKey'

              beforeEach(() => {
                action = AccountActions.withdrawBitcoinFromCoreWallet(
                  coreWalletWithdrawUrl,
                  recipientAddress,
                  coreAPIPassword,
                  null,
                  paymentKey
                )
              })

              it('== paymentKey provided as param', () =>
                store.dispatch(action)
                  .catch(() => assert.equal(getBody().paymentKey, paymentKey))

              )
            })
          })
        })

        describe('and when failing', () => {
          const error = new Error()

          beforeEach(() => {
            sinon.restore(global, 'fetch')
            sinon.stub(global, 'fetch').rejects(error)
          })

          it('logs an expressive error message', () =>
            store.dispatch(action)
              .catch(() => assert.deepEqual(loggerMock.error.firstCall.args, [
                'withdrawBitcoinFromCoreWallet:',
                error
              ])
            )
          )
        })

        describe('and when working', () => {
          describe('when provided with an erroneous response', () => {
            const errorFromResponse = 'an error'
            const erroneousResponse = JSON.stringify({error: errorFromResponse})

            beforeEach(() => {
              sinon.restore(global, 'fetch')
              sinon.stub(global, 'fetch').resolves({text: () => erroneousResponse})
            })

            it('dispatches withdrawCoreBalanceError with error', () =>
              store.dispatch(action)
                .then(() => assert.deepEqual(store.getActions()[1], {
                    type: WITHDRAW_CORE_BALANCE_ERROR,
                    error: errorFromResponse
                })
              )
            )
          })

          describe('when provided with a success response', () => {
            const successResponse = JSON.stringify({})

            beforeEach(() => {
              sinon.restore(global, 'fetch')
              sinon.stub(global, 'fetch').resolves({text: () => successResponse})
            })

            it('dispatches withdrawCoreBalanceSuccess', () =>
              store.dispatch(action)
                .then(() => assert.deepEqual(store.getActions()[1], {
                    type: WITHDRAW_CORE_BALANCE_SUCCESS
                })
              )
            )
          })
        })
      })
    })
  })

  describe('emailNotifications', () => {
    const email = 'nico.id@example.com'
    let optIn
    let action
    let store
    let loggerMock

    beforeEach(() => {
      loggerMock = {
        debug: sinon.spy()
      }
      sinon.stub(global, 'fetch').rejects(new Error())
      store = mockStore({})
      action = AccountActions.emailNotifications(
        email,
        optIn
      )
    })

    afterEach(() => {
      sinon.restore(global, 'fetch')
    })

    it('logs a debug message with email', () =>
      store.dispatch(action)
        .catch(() => assert.deepEqual(loggerMock.debug.firstCall.args, [
          `emailNotifications: ${email}`
        ]))
    )

    describe('dispatches promptedForEmail action', () => {
      it('with type PROMPTED_FOR_EMAIL', () =>
        store.dispatch(action)
          .catch(() => assert.equal(store.getActions()[0].type,
            PROMPTED_FOR_EMAIL
          ))
      )

      it('with email as provided', () =>
        store.dispatch(action)
          .catch(() => assert.equal(store.getActions()[0].email,
            email
          ))
      )
    })

    describe('fetches blockstack-portal-emailer', () => {
      describe('when optIn is truthy', () => {
        beforeEach(() => {
          optIn = 1
          action = AccountActions.emailNotifications(
            email,
            optIn
          )
        })

        it('with param optIn=true', () =>
          store.dispatch(action)
            .catch(() => assert.equal(global.fetch.firstCall.args[0],
              'https://blockstack-portal-emailer.appartisan.com/notifications?mailingListOptIn=true'
            ))
        )
      })

      describe('when optIn is falsy', () => {
        beforeEach(() => {
          optIn = 0
          action = AccountActions.emailNotifications(
            email,
            optIn
          )
        })

        it('with param optIn=false', () =>
          store.dispatch(action)
            .catch(() => assert.equal(global.fetch.firstCall.args[0],
              'https://blockstack-portal-emailer.appartisan.com/notifications?mailingListOptIn=false'
            ))
        )
      })

      describe('with options', () => {
        it('with method POST', () =>
          store.dispatch(action)
            .catch(() => assert.equal(global.fetch.firstCall.args[1].options.method,
              'POST'
            ))
        )

        it('with body JSON.stringify({email})', () =>
          store.dispatch(action)
            .catch(() => assert.equal(global.fetch.firstCall.args[1].options.body,
              JSON.strinfigy({ email })
            ))
        )

        it('with headers {Accetp and Content-Type: application/json}', () =>
          store.dispatch(action)
            .catch(() => assert.deepEqual(global.fetch.firstCall.args[1].options.headers, {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }))
        )
      })

      describe('and when failing', () => {
        const error = new Error()

        beforeEach(() => {
          sinon.restore(global, 'fetch')
          sinon.stub(global, 'fetch').rejects(error)
        })

        it('logs an expressive error', () =>
          store.dispatch(action)
            .catch(() => assert.deepEqual(loggerMock.error.firstCall.args, [
              'emailNotifications: error',
              error
            ]))
        )
      })

      describe('and when working', () => {
        beforeEach(() => {
          sinon.restore(global, 'fetch')
          sinon.stub(global, 'fetch').resolves()
        })

        it('logs a debug message with email', () =>
          store.dispatch(action)
            .catch(() => assert.deepEqual(loggerMock.debug.secondCall.args, [
              `emailNotifications: registered ${email} for notifications`
            ]))
        )
      })
    })
  })

  describe('skipEmailBackup', () => {
    let loggerMock
    let store

    beforeEach(() => {
      loggerMock = {
        trace: sinon.spy()
      }
      AccountActions.__Rewire__('logger', loggerMock)
      store = mockStore({})
      store.dispatch(AccountActions.skipEmailBackup())
    })

    afterEach(() =>
      AccountActions.__ResetDependency__('logger')
    )

    it('logs a trace message', () =>
      assert.deepEqual(loggerMock.trace.firstCall.args, [
        'skipEmailBackup'
      ])
    )

    it('dispatches action {type: PROMPTED_FOR_EMAIL, email: null}', () =>
      assert.deepEqual(store.getActions()[0], {
        type: PROMPTED_FOR_EMAIL,
        email: null
      })
    )
  })

  describe('storageIsConnected', () => {
    let loggerMock
    let store

    beforeEach(() => {
      loggerMock = {
        trace: sinon.spy()
      }
      AccountActions.__Rewire__('logger', loggerMock)
      store = mockStore({})
      store.dispatch(AccountActions.storageIsConnected())
    })

    afterEach(() =>
      AccountActions.__ResetDependency__('logger')
    )

    it('logs a trace message', () =>
      assert.deepEqual(loggerMock.trace.firstCall.args, [
        'storageConnected'
      ])
    )

    it('dispatches action {type: CONNECTED_STORAGE}', () =>
      assert.deepEqual(store.getActions()[0], {
        type: CONNECTED_STORAGE
      })
    )
  })

  describe('updateViewedRecoveryCode', () => {
    describe('returns action', () => {
      let action

      beforeEach(() => {
        action = AccountActions.updateViewedRecoveryCode()
      })

      it('{type: VIEWED_RECOVERY_CODE}', () =>
        assert.deepEqual(action, {
          type: VIEWED_RECOVERY_CODE
        })
      )
    })
  })

  describe('doVerifyRecoveryCode', () => {
    let store

    beforeEach(() => {
      store = mockStore({})
      store.dispatch(AccountActions.doVerifyRecoveryCode())
    })

    it('dispatches action {type: RECOVERY_CODE_VERIFIED}', () =>
      assert.deepEqual(store.getActions()[0], {
        type: RECOVERY_CODE_VERIFIED
      })
    )
  })

  describe('incrementIdentityAddressIndex', () => {
    describe('returns action', () => {
      let action

      beforeEach(() => {
        action = AccountActions.incrementIdentityAddressIndex()
      })

      it('{type: INCREMENT_IDENTITY_ADDRESS_INDEX}', () =>
        assert.deepEqual(action, {
          type: INCREMENT_IDENTITY_ADDRESS_INDEX
        })
      )
    })
  })

  describe('usedIdentityAddress', () => {
    let loggerMock
    let store

    beforeEach(() => {
      loggerMock = {
        trace: sinon.spy()
      }
      AccountActions.__Rewire__('logger', loggerMock)
      store = mockStore({})
      store.dispatch(AccountActions.usedIdentityAddress())
    })

    afterEach(() =>
      AccountActions.__ResetDependency__('logger')
    )

    it('logs a trace message', () =>
      assert.deepEqual(loggerMock.trace.firstCall.args, [
        'usedIdentityAddress'
      ])
    )

    it('dispatches action {type: INCREMENT_IDENTITY_ADDRESS_INDEX}', () =>
      assert.deepEqual(store.getActions()[0], {
        type: INCREMENT_IDENTITY_ADDRESS_INDEX
      })
    )
  })

  describe('displayedRecoveryCode', () => {
    let loggerMock
    let store

    beforeEach(() => {
      loggerMock = {
        trace: sinon.spy()
      }
      AccountActions.__Rewire__('logger', loggerMock)
      store = mockStore({})
      store.dispatch(AccountActions.displayedRecoveryCode())
    })

    afterEach(() =>
      AccountActions.__ResetDependency__('logger')
    )

    it('logs a trace message', () =>
      assert.deepEqual(loggerMock.trace.firstCall.args, [
        'displayedRecoveryCode'
      ])
    )

    it('dispatches action {type: VIEWED_RECOVERY_CODE}', () =>
      assert.deepEqual(store.getActions()[0], {
        type: VIEWED_RECOVERY_CODE
      })
    )
  })

  describe('newIdentityAddress', () => {
    describe('returns action', () => {
      const newIdentityKeypair = 'fakeNewIdentityKeyPair'
      let action

      beforeEach(() => {
        action = AccountActions.newIdentityAddress(newIdentityKeypair)
      })

      it('with type NEW_IDENTITY_ADDRESS', () =>
        assert.equal(action.type, NEW_IDENTITY_ADDRESS)
      )

      it('with keypair passed as first param', () =>
        assert.equal(action.keypair, newIdentityKeypair)
      )
    })
  })
})
