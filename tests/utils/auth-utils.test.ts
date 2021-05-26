import { isValidUrl } from '@common/validation/validate-url';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import bigListOfNaughtyStrings from 'blns';

describe('isValidUrl', () => {
  test('accepts normal URLs', () => {
    const normal = [
      'http://example.com',
      'https://blockstack.com/asdf?hey=true',
      'https://blockstack.org/asdf#anchor',
    ];

    normal.forEach(url => {
      expect(isValidUrl(url)).toEqual(true);
    });
  });

  test('rejects non http(s) schemas', () => {
    // one of the strings is a actual url
    const naughtyStrings = (bigListOfNaughtyStrings as string[]).filter(
      str => !str.startsWith('http')
    );
    const bad = [
      ...naughtyStrings,
      'javascript:alert("hello")//',
      'web.org',
      'javascript:console.log();',
      'javascripT:console.log();',
      'JaVascRipt:console.log();',
    ];

    bad.forEach(url => {
      expect(isValidUrl(url)).toEqual(false);
    });
  });
});
