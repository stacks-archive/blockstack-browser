import { AssetWithMeta, NftMeta } from '@common/asset-types';
import { mergeAssetBalances, mergeNftBalances, NftMetaRecord } from '@store/assets/tokens';
import BigNumber from 'bignumber.js';

describe(mergeAssetBalances.name, () => {
  test('it merges fungible balances (anchored & unanchored) correctly', () => {
    // Merge balances
    const assets: AssetWithMeta[] = [
      {
        type: 'stx',
        contractAddress: '',
        contractName: '',
        balance: new BigNumber('993992057'),
        subtitle: 'STX',
        name: 'Stacks Token',
        canTransfer: true,
        hasMemo: true,
      },
      {
        type: 'ft',
        subtitle: 'ST6G7…PSTK7.stella-the-cat',
        contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
        contractName: 'stella-the-cat',
        name: 'stella-token',
        balance: new BigNumber('2469135782'),
        meta: {
          name: 'SteLLa the Cat',
          symbol: 'CAT',
          decimals: 9,
        },
        canTransfer: true,
        hasMemo: true,
      },
      {
        type: 'ft',
        subtitle: 'ST6G7…PSTK8.alf-the-dog',
        contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK8',
        contractName: 'alf-the-dog',
        name: 'alf-token',
        balance: new BigNumber('9469135782'),
        meta: {
          name: 'Alf the Dog',
          symbol: 'ALF',
          decimals: 9,
        },
        canTransfer: true,
        hasMemo: true,
      },
    ];

    const unanchoredAssets: AssetWithMeta[] = [
      {
        type: 'stx',
        contractAddress: '',
        contractName: '',
        balance: new BigNumber('991992057'),
        subtitle: 'STX',
        name: 'Stacks Token',
        canTransfer: true,
        hasMemo: true,
      },
      {
        type: 'ft',
        subtitle: 'ST6G7…PSTK7.stella-the-cat',
        contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK7',
        contractName: 'stella-the-cat',
        name: 'stella-token',
        balance: new BigNumber('1469135782'),
        meta: {
          name: 'SteLLa the Cat',
          symbol: 'CAT',
          decimals: 9,
        },
        canTransfer: true,
        hasMemo: true,
      },
      {
        type: 'ft',
        subtitle: 'ST6G7…PSTK9.boxer-the-horse',
        contractAddress: 'ST6G7N19FKNW24XH5JQ5P5WR1DN10QWMKQSPSTK9',
        contractName: 'boxer-the-horse',
        name: 'boxer-token',
        balance: new BigNumber('7000100702'),
        meta: {
          name: 'Boxer the Horse',
          symbol: 'BOX',
          decimals: 9,
        },
        canTransfer: true,
        hasMemo: true,
      },
    ];

    const mergedAssets = mergeAssetBalances(assets, unanchoredAssets, 'ft');

    expect(mergedAssets.length).toEqual(assets.length - 1 + 1); // remove the stx asset but add the new ft token

    for (let tokenName of ['stella-token', 'alf-token', 'boxer-token']) {
      let token = assets.find(asset => asset && asset.name === tokenName);
      let tokenUnanchored = unanchoredAssets.find(asset => asset && asset.name === tokenName);
      let tokenMerged = mergedAssets.find(asset => asset && asset.name === tokenName);
      if (token && tokenUnanchored) {
        // if there is a token in the anchored balance it should be present in the merge as balance
        expect(tokenMerged.balance).toEqual(token.balance);
        expect(tokenMerged.subBalance).toEqual(tokenUnanchored.balance);
      } else if (token && !tokenUnanchored) {
        expect(tokenMerged.balance).toEqual(token.balance);
        expect(tokenMerged.subBalance).toEqual('0');
      } else if (!token && tokenUnanchored) {
        expect(tokenMerged.balance).toEqual('0');
        // If there is a token in the unanchored balance it should be present in the merge as subBalance
        expect(tokenMerged.subBalance).toEqual(tokenUnanchored.balance);
      }
    }
  });
});

describe(mergeAssetBalances.name, () => {
  test('it merges non-fungible balances (anchored & unanchored) correctly', () => {
    const anchoredNfts: NftMetaRecord = {
      'ST9VQ21ZEGG54JDFE39B99ZBTSFSWMEC323MENFG.animal::ANIMAL': {
        count: '1',
        total_sent: '1',
        total_received: '2',
      },
      'ST9VQ21ZEGG54JDFE39B99ZBTSFSWMEC323MENFF.animal::PLANET': {
        count: '1',
        total_sent: '0',
        total_received: '1',
      },
    };

    const unanchoredNfts: NftMetaRecord = {
      'ST9VQ21ZEGG54JDFE39B99ZBTSFSWMEC323MENFG.animal::ANIMAL': {
        count: '0',
        total_sent: '2',
        total_received: '2',
      },
      'ST9VQ21ZEGG54JDFE39B99ZBTSFSWMEC323MENFF.animal::FLOWER': {
        count: '1',
        total_sent: '0',
        total_received: '1',
      },
    };

    const mergedAssets: NftMeta[] = mergeNftBalances(anchoredNfts, unanchoredNfts);

    for (let nftName of Object.keys(anchoredNfts)) {
      let token: NftMeta = anchoredNfts[nftName];
      let tokenUnanchored = unanchoredNfts[nftName];
      let tokenMerged = mergedAssets.find(asset => asset && asset.key === nftName);
      if (token && tokenUnanchored) {
        // if there is a token in the anchored count it should be present in the merge as count
        expect(tokenMerged?.count).toEqual(token.count);
        expect(tokenMerged?.subCount).toEqual(tokenUnanchored.count);
      } else if (token && !tokenUnanchored) {
        expect(tokenMerged?.count).toEqual(token.count);
        expect(tokenMerged?.subCount).toEqual('0');
      } else if (!token && tokenUnanchored) {
        expect(tokenMerged?.count).toEqual('0');
        // If there is a token in the unanchored count it should be present in the merge as subCount
        expect(tokenMerged?.subCount).toEqual(tokenUnanchored.count);
      }
    }
  });
});
