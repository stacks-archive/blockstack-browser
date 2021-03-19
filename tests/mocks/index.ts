export { setupMocks } from './playwright-mocks';
import { Wallet } from '@stacks/wallet-sdk';

export const SECRET_KEY =
  'invite helmet save lion indicate chuckle world pride afford hard broom draft';

export const TX_REQUEST =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJzdHhBZGRyZXNzIjoiU1QzNVozWVFDVEMxV1o4WjdBS0hHRTkxSEswNVdLTUtQVE4xS1g3UTciLCJuZXR3b3JrIjp7InZlcnNpb24iOjEyOCwiY2hhaW5JZCI6MjE0NzQ4MzY0OCwiY29yZUFwaVVybCI6Imh0dHBzOi8vc3RhY2tzLW5vZGUtYXBpLnhlbm9uLmJsb2Nrc3RhY2sub3JnIiwiYm5zTG9va3VwVXJsIjoiaHR0cHM6Ly9jb3JlLmJsb2Nrc3RhY2sub3JnIiwiYnJvYWRjYXN0RW5kcG9pbnQiOiIvdjIvdHJhbnNhY3Rpb25zIiwidHJhbnNmZXJGZWVFc3RpbWF0ZUVuZHBvaW50IjoiL3YyL2ZlZXMvdHJhbnNmZXIiLCJhY2NvdW50RW5kcG9pbnQiOiIvdjIvYWNjb3VudHMiLCJjb250cmFjdEFiaUVuZHBvaW50IjoiL3YyL2NvbnRyYWN0cy9pbnRlcmZhY2UiLCJyZWFkT25seUZ1bmN0aW9uQ2FsbEVuZHBvaW50IjoiL3YyL2NvbnRyYWN0cy9jYWxsLXJlYWQifSwiYXV0aE9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsIm1lbW8iOiJGcm9tIGRlbW8gYXBwIiwicmVjaXBpZW50IjoiU1RCNDRIWVBZQVQyQkIyUUU1MTNOU1A4MUhUTVlXQkpQMDJIUEdLNiIsImFtb3VudCI6IjEwMiIsInB1YmxpY0tleSI6IjAyYzY3ZTZlZWMzYzY2MzY4MDU3MzIwZTYzMWNmZjAzZjFmMzY5MjI4ZDI0Mzc5ZjM1OGEwYWU4ZmY5NDJlNGVmZiIsInR4VHlwZSI6InRva2VuX3RyYW5zZmVyIiwiYXBwRGV0YWlscyI6eyJuYW1lIjoiVGVzdGluZyBBcHAiLCJpY29uIjoiL2Fzc2V0cy9tZXNzZW5nZXItYXBwLWljb24ucG5nIn19.SQm6Pg_ny1J0o9iReIfY2D9jkYUvaER-lmHe2Jxc8opfASH8bplRN1FlI8SQ4dOLO0rfvjvIaCV4qbPAylnNSA';

export const TEST_WALLET: Wallet = {
  salt: 'e95b8fed404c4130267b15be0df5aecb7c118f1297bf25d096e2bf442ec7b1a7',
  rootKey:
    'xprv9s21ZrQH143K2bCXs73Bt3sfzEXzMCgRgtmDJ7R7K6cMgMFq95EvBM8DWTd7bSZthijgPrzxStburCzvQ6dxA2mmpPKGTxCi9peyPyMeJ3B',
  configPrivateKey: '3b6d03391916e05f549eb08d47f931b7c368ec4fda37d2150f160af1a8671a41',
  encryptedSecretKey:
    '5ed9074b9b35be315e4191f06354ebc91b103b662fca3623c8d99cd960d9c070d437f29329112db63de32c970c9bd2ed02afaee55b32d1dce063b1db7aa178b39b230cf5b1ec4245495f89a69a27237c',
  accounts: [
    {
      stxPrivateKey: 'cc440106121617d5ea23646552aa40a62316878293a1baa7a02fbb071b8cbe2901',
      dataPrivateKey: '504b91ea465bb9f6c28a38432869bd04dbeb85b46525bcf5e9615a9ddfcc178c',
      appsKey:
        'xprvA2KzZmgR2PMM55CgbWxRC6K74n4ANrBitjxKnKmEJYLq4tfQX5p17NpUx9gvk4fnnJDym14E1hixmDzjfbt4Fmf73g1RcvQZpMzih81Lg1S',
      salt: 'e95b8fed404c4130267b15be0df5aecb7c118f1297bf25d096e2bf442ec7b1a7',
      index: 0,
    },
    {
      stxPrivateKey: '1499c9194feed4cbca3bd9f7a2b3413684d30c1a9d8a7f044398f9e27ae5d00301',
      dataPrivateKey: 'f96a1e65ce95db1ee6ff2e53988d4a3524c433548758d95354ea05fc24cc4505',
      appsKey:
        'xprvA1eQc5DGP8KU275yPdXUbWXPW4Ba2h2poSpXnV5jxxfpPghuaP4p8R1YHg8MsmqGpwFQU4R74cU5x8E7dExQN14cvPHn6c1vxajxWjQxTpM',
      salt: 'e95b8fed404c4130267b15be0df5aecb7c118f1297bf25d096e2bf442ec7b1a7',
      index: 1,
      username: 'fdsfdsfdf.id.blockstack',
    },
    {
      stxPrivateKey: 'b8e5b2c33be621fb16a5260b30d526cadc7087d58736f2f3c6f84d31be452b6601',
      dataPrivateKey: 'bdcc48a4b8c098a7cb06e7221ee0b784c05083353dad964674a4eebfaa104f0d',
      appsKey:
        'xprvA1vvF4rkEyBDLuvQKTa9YvCNKHcTNsrBwD5imsnnatG9RiyF5634o2GBwb5YvjC237LK6k273xRmaiCsNKpbS2EXUGPTtWo3CBFKRmzEHti',
      salt: 'e95b8fed404c4130267b15be0df5aecb7c118f1297bf25d096e2bf442ec7b1a7',
      index: 2,
      username: 'thisis45678.id.blockstack',
    },
    {
      stxPrivateKey: 'da62811e06fe6fb394982a740fdcab6f1194ed85c5f6421021777638512d41ee01',
      dataPrivateKey: '522a6fb27d2255c30ab7d83ffc3b43cda4627c505619f0bb1e7de66c297bc53c',
      appsKey:
        'xprvA23n53oLHrMsQcVULk6UBg3PJUWHC3L6W8DmKqzGEVprqjSF1qs8hcZfP3H1zg1asSUDDZBXNw81p5BBALZorQz2fKNeWGfwmRhUsbMiVsH',
      salt: 'e95b8fed404c4130267b15be0df5aecb7c118f1297bf25d096e2bf442ec7b1a7',
      index: 3,
      username: 'integration_tester.test-personal.id',
    },
  ],
};
