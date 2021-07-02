import { act, renderHook } from '@testing-library/react-hooks';
import {
  parsePrincipalString,
  PayloadType,
  StacksTransaction,
  TokenTransferPayload,
} from '@stacks/transactions';
import { setupHeystackEnv } from '../../../../tests/mocks/heystack';
import { ProviderWithWalletAndRequestToken } from '../../../../tests/state-utils';
import { useMakeStxTransfer } from '@pages/transaction-signing/hooks/use-make-stx-transfer';
import { stxToMicroStx } from '@common/stacks-utils';

const MEMO = 'hello world';
const AMOUNT = 25; // STX
const RECIPIENT = 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N';
const EXPECTED_FEE = 180;
const EXPECTED_AMOUNT_IN_USTX = stxToMicroStx(AMOUNT).toNumber();
const EXPECTED_RECIPIENT = parsePrincipalString(RECIPIENT).address;

describe(useMakeStxTransfer.name, () => {
  setupHeystackEnv();
  it('correctly generates signed transaction for a token transfer', async () => {
    const { result } = renderHook(() => useMakeStxTransfer(), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    let response: StacksTransaction | undefined;
    await act(async () => {
      response = await result.current({
        memo: MEMO,
        amount: AMOUNT,
        recipient: RECIPIENT,
      });
    });

    expect(response).toBeTruthy();
    expect(response?.payload.payloadType).toEqual(PayloadType.TokenTransfer);
    expect(response?.auth.spendingCondition?.fee.toNumber()).toEqual(EXPECTED_FEE);

    const payload = response?.payload as TokenTransferPayload;

    expect(payload.amount.toNumber()).toEqual(EXPECTED_AMOUNT_IN_USTX);
    expect(payload.recipient.address).toEqual(EXPECTED_RECIPIENT);
    expect(payload.memo.content).toEqual(MEMO);
  });
});
