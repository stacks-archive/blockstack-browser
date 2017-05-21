import { AccountActions } from '../../../../../app/js/account/store/account'

describe('Account Store: Sync Actions', () => {
  describe('initializeWallet', () => {
    it('returns an encrypted backup phrase & master keychain for new wallet', () => {
      const password = 'password'

      const actualResult = AccountActions.initializeWallet(password)

      const expectedResult = [{ type: 'UPDATE_BTC_PRICE',
                                 price: '1168.98'
                               }]

      const dispatch = (action) => {
        console.log(action)
        assert.deepEqual(action, expectedResult)
      }
      actualResult(dispatch)
    })
  })
})
