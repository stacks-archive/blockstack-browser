import { isUri } from 'valid-url';

// https://stackoverflow.com/a/5717133/1141891
export function validUrl(str: string) {
  const sanitized = isUri(str);
  return !!sanitized;
}
