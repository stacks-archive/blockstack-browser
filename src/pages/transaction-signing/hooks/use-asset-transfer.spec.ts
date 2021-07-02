import { act, renderHook } from '@testing-library/react-hooks';
import {
  ContractCallPayload,
  parsePrincipalString,
  PayloadType,
  StacksTransaction,
} from '@stacks/transactions';
import { useMakeAssetTransfer } from '@pages/transaction-signing/hooks/use-asset-transfer';
import { setupHeystackEnv } from '@tests/mocks/heystack';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import { HEYSTACK_HEY_TX_REQUEST_DECODED } from '@tests/mocks';

const MEMO = 'hello world';
const AMOUNT = 25;
const RECIPIENT = 'ST21FTC82CCKE0YH9SK5SJ1D4XEMRA069FKV0VJ8N';
const FUNCTION_NAME = 'transfer';
const EXPECTED_FEE = 311;
const EXPECTED_FUNCTION_ARG_LENGTH = 4;

describe(useMakeAssetTransfer.name, () => {
  setupHeystackEnv();
  it('correctly generates signed transaction for heystack transfer', async () => {
    const { result } = renderHook(() => useMakeAssetTransfer(), {
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

    const amount = (response?.payload as ContractCallPayload).functionArgs[0] as any;
    const sender = (response?.payload as ContractCallPayload).functionArgs[1] as any;
    const recipient = (response?.payload as ContractCallPayload).functionArgs[2] as any;
    const memo = (response?.payload as ContractCallPayload).functionArgs[3] as any;

    expect(response).toBeTruthy();
    expect(response?.payload.payloadType).toEqual(PayloadType.ContractCall);
    expect((response?.payload as ContractCallPayload).functionName.content).toEqual(FUNCTION_NAME);
    expect(response?.auth.spendingCondition?.fee.toNumber()).toEqual(EXPECTED_FEE);
    expect((response?.payload as ContractCallPayload).functionArgs.length).toEqual(
      EXPECTED_FUNCTION_ARG_LENGTH
    );
    expect(amount.value.toNumber()).toEqual(AMOUNT);
    expect(sender.address).toEqual(
      parsePrincipalString(HEYSTACK_HEY_TX_REQUEST_DECODED.stxAddress).address
    );
    expect(recipient.address).toEqual(parsePrincipalString(RECIPIENT).address);
    expect(memo.value.buffer.toString('utf-8')).toEqual(MEMO);
  });
});
