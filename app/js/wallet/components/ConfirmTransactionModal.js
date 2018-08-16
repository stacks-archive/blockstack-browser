import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from '../../account/store/account'
import { summarizeTransactionFromHex, satoshisToBtc } from '@utils/bitcoin-utils'
import SimpleButton from '@components/SimpleButton'


class ConfirmTransactionModal extends React.Component {
  broadcastTransaction = () => {
    this.props.broadcastBitcoinTransaction(this.props.regTestMode, this.props.txHex)
  }

  render() {
    const { isOpen, handleClose, txHex, isBroadcasting, amountInput } = this.props
    const summary = txHex && summarizeTransactionFromHex(txHex)
    const amountFloat = parseFloat(amountInput)
    const fee = summary && amountFloat ? summary.total - amountFloat : 0
    console.log(summary.total)
    console.log(amountFloat)

    return (
      <Modal
        className="container-fluid"
        isOpen={isOpen}
        onRequestClose={handleClose}
      >
        <h3 className="modal-heading">
          Confirm Transaction
        </h3>
        <div className="modal-body">
          {summary &&
            <p style={{ textAlign: 'center' }}>
              Are you sure you want to send{' '}
              <strong>{satoshisToBtc(summary.outs[0].satoshis)} BTC</strong>
              {' '}to{' '}
              <code>{summary.outs[0].address}</code>
              {!!fee && (
                <React.Fragment>
                  {' '}with a transaction fee of{' '}
                  <strong>{satoshisToBtc(fee).toFixed(8)} BTC</strong>
                </React.Fragment>
              )}
              ?
            </p>
          }
        </div>
        <SimpleButton type="primary" loading={isBroadcasting} onClick={this.broadcastTransaction} block>
          Confirm
        </SimpleButton>
        <SimpleButton type="tertiary" onClick={handleClose} block>
          Cancel
        </SimpleButton>
      </Modal>
    )
  }
}

ConfirmTransactionModal.propTypes = {
  // Own props
  isOpen: PropTypes.bool,
  txHex: PropTypes.string,
  amountInput: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  // Redux props
  regTestMode: PropTypes.bool,
  isBroadcasting: PropTypes.bool,
  broadcastBitcoinTransaction: PropTypes.func.isRequired
}

export default connect((state) => ({
  regTestMode: state.settings.api.regTestMode,
  isBroadcasting: state.account.coreWallet.withdrawal.isBroadcasting
}), (dispatch) =>
  bindActionCreators({ ...AccountActions }, dispatch)
)(ConfirmTransactionModal)
