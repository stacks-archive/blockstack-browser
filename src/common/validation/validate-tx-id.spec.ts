import { validateTxId } from '@common/validation/validate-tx-id';

const TX_ID_WITH_NO_0x = '117a6522b4e9ec27ff10bbe3940a4a07fd58e5352010b4143992edb05a7130c7';
const TX_ID = '0x117a6522b4e9ec27ff10bbe3940a4a07fd58e5352010b4143992edb05a7130c7';
const INVALID_EXAMPLE =
  'Failed to deserialize posted transaction: Invalid Stacks string: non-printable or non-ASCII string';

describe(validateTxId.name, () => {
  test('correctly validates a txid without 0x', () => {
    expect(validateTxId(TX_ID_WITH_NO_0x)).toEqual(true);
  });
  test('correctly validates a txid with 0x', () => {
    expect(validateTxId(TX_ID)).toEqual(true);
  });
  test('errors when it is too short', () => {
    expect(validateTxId(TX_ID.split('30c7')[0])).toEqual(false);
  });
  test('errors when a message is passed', () => {
    expect(validateTxId(INVALID_EXAMPLE)).toEqual(false);
  });
});
