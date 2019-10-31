import React from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Box, Input, Text, Button } from '@blockstack/ui'
import { IAppState } from '@store'
import { doStoreSeed } from '@store/wallet'
import * as WalletActions from '@store/wallet/actions'
import { Formik } from 'formik'
import { selectCurrentWallet, selectSeed } from '@store/wallet/selectors'

const Seed = () => {
  const { wallet, seed } = useSelector((state: IAppState) => ({
    wallet: selectCurrentWallet(state),
    seed: selectSeed(state)
  }))
  const dispatch = useDispatch()
  console.log(wallet)

  return (
    <Box width="100%">
      <Text>{seed && seed.length ? "You're logged in!" : 'Enter a 12-word seed to login.'}</Text>
      <Formik
        initialValues={{
          seed: ''
        }}
        onSubmit={values => {
          if (values.seed && values.seed.length) dispatch(doStoreSeed(values.seed))
        }}
      >
        {({ handleSubmit, values, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <Input
              textStyle="body.small"
              mt={4}
              type="text"
              value={values.seed}
              onChange={handleChange}
              placeholder="Enter your 12 word seed"
            />
            <Button mt={4}>Save</Button>
          </form>
        )}
      </Formik>
    </Box>
  )

  return (
    <Box width="100%">
      {/* <Box width={1}> */}
      <p>Seed is: {seed}</p>
      <input type="text" onChange={evt => setSeed(evt.target.value)} value={seed} />
      <p>
        <a href="#" onClick={saveSeed}>
          Save
        </a>
      </p>
      {/* </Box> */}
    </Box>
  )
}

const mapStateToProps = (state: IAppState) => ({
  seed: state.wallet.seed,
  wallet: state.wallet.currentWallet
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ ...WalletActions }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Seed)
