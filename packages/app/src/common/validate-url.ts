import { isWebUri } from 'valid-url';

export function isValidUrl(str: string) {
  return !!isWebUri(str);
}
