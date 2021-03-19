import { useMemo } from 'react';
import { Account, getStxAddress } from '@stacks/wallet-sdk';
import { TransactionVersion } from '@stacks/transactions';
import { generateHash, hashValue, moduloRange, stringToHslColor } from '@stacks/ui-utils';
import chroma from 'chroma-js';

// this file will be added to @stacks/ui when it's finalized.

function toHex(str: string) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}

function generateGradientType(string: string) {
  const gradientType = `${hashValue(string, ['linear', 'radial'])}-gradient`;
  const isLinear = gradientType === 'linear-gradient';

  if (!isLinear) {
    const radialModifier = `${hashValue(string, [
      'farthest-side',
      'farthest-corner',
      'circle',
      'closest-side',
      'closest-corner',
      'ellipse',
    ])} at ${Math.abs(moduloRange(generateHash(string), [isLinear ? 0 : 50, 100], true))}%`;
    return `${gradientType}(${radialModifier}`;
  } else {
    const linearModifier = `${Math.abs(generateHash(string) % 360)}deg`;
    return `${gradientType}(${linearModifier}`;
  }
}

export function useAccountGradient(account: Account) {
  return useMemo(() => {
    // always mainnet, so people can associate color with an account regardless of network
    const transactionVersion = TransactionVersion.Mainnet;

    const stxAddress = getStxAddress({ account, transactionVersion });
    const pubKeyLikeString = toHex(stxAddress);

    const bg = stringToHslColor(stxAddress, 50, 60);
    let bg2 = stringToHslColor(pubKeyLikeString, 50, 60);
    const bg3 = stringToHslColor(pubKeyLikeString + '__' + stxAddress, 50, 60);

    const contrast = chroma.contrast(bg, bg2);

    if (contrast < 1.15) {
      bg2 = chroma(bg2).darken(1.25).hex();
    }

    const gradientTypeString = stxAddress + '__' + pubKeyLikeString;
    const gradientType = generateGradientType(gradientTypeString);

    return `${gradientType}, ${bg3} 0%, ${bg2} 70%, ${bg} 100%)`;
  }, [account]);
}
