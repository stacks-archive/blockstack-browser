import { act, renderHook } from '@testing-library/react-hooks';
import {
  deserializeTransaction,
  parsePrincipalString,
  StacksTransaction,
  TokenTransferPayload,
} from '@stacks/transactions';
import { PostRequests, setupHeystackEnv } from '../../../../tests/mocks/heystack';
import { ProviderWithWalletAndRequestToken } from '../../../../tests/state-utils';
import { useMakeStxTransfer } from '@pages/transaction-signing/hooks/use-make-stx-transfer';
import { stxToMicroStx } from '@common/stacks-utils';
import { useHandleSubmitTransaction } from '@pages/transaction-signing/hooks/use-submit-stx-transaction';

const MEMO = 'hello world';
const AMOUNT = 25; // STX
const RECIPIENT = 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N';
const EXPECTED_FEE = 180;
const EXPECTED_AMOUNT_IN_USTX = stxToMicroStx(AMOUNT).toNumber();
const EXPECTED_RECIPIENT = parsePrincipalString(RECIPIENT).address;

function getCleanMemo(memo: string) {
  // very strange bug in stacks.js?
  // need to do this in explorer, too
  // the memo ends up as "hello world\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
  return memo.replace(
    '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00',
    ''
  );
}

describe(useHandleSubmitTransaction.name, () => {
  let broadcastedTxRaw: undefined | string;
  setupHeystackEnv({
    [PostRequests.broadcastTransaction]: (req, res, ctx) => {
      broadcastedTxRaw = req.body;
      return res(ctx.json(null));
    },
  });
  it('correctly broadcasts stx transfer', async () => {
    const stxTx = renderHook(() => useMakeStxTransfer(), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    let transaction: StacksTransaction | undefined;
    await act(async () => {
      transaction = await stxTx.result.current({
        memo: MEMO,
        amount: AMOUNT,
        recipient: RECIPIENT,
      });
    });

    if (!transaction) throw Error('no transaction');

    const onClose = jest.fn(() => console.log('closed'));

    const { result } = renderHook(
      () =>
        useHandleSubmitTransaction({
          transaction: transaction as StacksTransaction,
          onClose,
          loadingKey: 'testing',
        }),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );

    await act(async () => {
      await result.current();
    });
    expect(onClose).toBeCalledTimes(1);
    expect(broadcastedTxRaw).toEqual(transaction.serialize().toString('hex'));
    const tx = await deserializeTransaction(broadcastedTxRaw as string);
    const payload = tx.payload as TokenTransferPayload;
    expect(tx?.auth.spendingCondition?.fee.toNumber()).toEqual(EXPECTED_FEE);
    expect(payload.amount.toNumber()).toEqual(EXPECTED_AMOUNT_IN_USTX);
    expect(payload.recipient.address).toEqual(EXPECTED_RECIPIENT);
    console.log(payload.memo);
    expect(getCleanMemo(payload.memo.content)).toEqual(MEMO);
  });
});
