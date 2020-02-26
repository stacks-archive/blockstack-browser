import React from 'react';

export const usernameInputId = 'username';

export const PasswordManagerHiddenInput = ({ secretKey }: { secretKey?: string }) => {
  if (!secretKey) return null;
  return (
    <>
      <label style={{ opacity: 0, position: 'absolute' }} aria-hidden htmlFor={usernameInputId}>
        Username
      </label>
      <label style={{ opacity: 0, position: 'absolute' }} aria-hidden>
        Secret Key
        <input
          id="secret-key"
          type="password"
          autoComplete="new-password"
          defaultValue={secretKey}
          aria-hidden="true"
        />
      </label>
    </>
  );
};
