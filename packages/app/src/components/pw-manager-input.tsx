import React from 'react';

interface PasswordManagerHiddenInput {
  secretKey?: string;
  appName?: string;
}

const visuallyHiddenProps = { opacity: 0, position: 'absolute' } as const;

const passwordManagerUsername = (appName?: string) =>
  'Blockstack Secret Key' + (!!appName && ` ${appName} `);

export const PasswordManagerHiddenInput = ({ secretKey, appName }: PasswordManagerHiddenInput) => {
  if (!secretKey) return null;
  return (
    <>
      <label style={visuallyHiddenProps} htmlFor="username">
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={passwordManagerUsername(appName)}
        />
      </label>
      <label style={visuallyHiddenProps} htmlFor="password">
        Secret Key
        <input
          id="secret-key"
          type="password"
          name="password"
          autoComplete="new-password"
          defaultValue={secretKey}
        />
      </label>
    </>
  );
};
