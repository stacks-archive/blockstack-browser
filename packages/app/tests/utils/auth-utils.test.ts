import { isValidUrl } from '../../src/common/validate-url';

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
    const bad = ['javascript:alert("hello")//', 'web.org', 'javascript:console.log();'];

    bad.forEach(url => {
      expect(isValidUrl(url)).toEqual(false);
    });
  });
});
