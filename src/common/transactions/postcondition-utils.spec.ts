import { handlePostConditions } from '@common/transactions/postcondition-utils';
import {
  createAssetInfo,
  hexToCV,
  makeContractNonFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  NonFungibleConditionCode,
  parsePrincipalString,
} from '@stacks/transactions';

const SENDER_ADDRESS = 'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW';

describe(handlePostConditions.name, function () {
  it('should not modify a post condition where the principal is a contract', () => {
    const postCondition = makeContractNonFungiblePostCondition(
      SENDER_ADDRESS,
      'btc-nft-swap-v1',
      NonFungibleConditionCode.DoesNotOwn,
      createAssetInfo(
        'ST248HH800501WYSG7Z2SS1ZWHQW1GGH85Q6YJBCC',
        'passive-blue-marmot',
        'layer-nft'
      ),
      hexToCV('0x0100000000000000000000000000000003')
    );
    const transformedPostCondition = handlePostConditions(
      [postCondition],
      SENDER_ADDRESS,
      SENDER_ADDRESS
    );

    expect(transformedPostCondition[0]).toEqual(postCondition);
  });

  it('should not modify a post condition when all addresses are the same (sender, current address, and postcondition principal)', () => {
    const postCondition = makeStandardNonFungiblePostCondition(
      SENDER_ADDRESS,
      NonFungibleConditionCode.DoesNotOwn,
      createAssetInfo(
        'ST248HH800501WYSG7Z2SS1ZWHQW1GGH85Q6YJBCC',
        'passive-blue-marmot',
        'layer-nft'
      ),
      hexToCV('0x0100000000000000000000000000000003')
    );
    const transformedPostCondition = handlePostConditions(
      [postCondition],
      SENDER_ADDRESS,
      SENDER_ADDRESS
    );

    expect(transformedPostCondition[0]).toEqual(postCondition);
  });

  it('should modify a post condition when currentAddress is different, but payload address is of the same type as the principal in the post condition', () => {
    const CURRENT_ADDRESS = 'ST248HH800501WYSG7Z2SS1ZWHQW1GGH85Q6YJBCC';
    const postCondition = makeStandardNonFungiblePostCondition(
      SENDER_ADDRESS,
      NonFungibleConditionCode.DoesNotOwn,
      createAssetInfo(
        'ST248HH800501WYSG7Z2SS1ZWHQW1GGH85Q6YJBCC',
        'passive-blue-marmot',
        'layer-nft'
      ),
      hexToCV('0x0100000000000000000000000000000003')
    );
    const transformedPostCondition = handlePostConditions(
      [postCondition],
      SENDER_ADDRESS,
      CURRENT_ADDRESS
    );

    expect(transformedPostCondition[0].principal.address).toEqual(
      parsePrincipalString(CURRENT_ADDRESS).address
    );
  });

  it('should not modify a post condition when currentAddress is same, but payload address is different type as the principal in the post condition', () => {
    const PAYLOAD_ADDRESS = 'ST248HH800501WYSG7Z2SS1ZWHQW1GGH85Q6YJBCC';
    const postCondition = makeStandardNonFungiblePostCondition(
      SENDER_ADDRESS,
      NonFungibleConditionCode.DoesNotOwn,
      createAssetInfo(
        'ST248HH800501WYSG7Z2SS1ZWHQW1GGH85Q6YJBCC',
        'passive-blue-marmot',
        'layer-nft'
      ),
      hexToCV('0x0100000000000000000000000000000003')
    );
    const transformedPostCondition = handlePostConditions(
      [postCondition],
      PAYLOAD_ADDRESS,
      SENDER_ADDRESS
    );

    expect(transformedPostCondition[0].principal.address).toEqual(
      parsePrincipalString(SENDER_ADDRESS).address
    );
  });
});
