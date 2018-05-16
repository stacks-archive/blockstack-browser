import React from 'react';
import styled, { css } from 'styled-components';

const User = styled.div``;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  text-transform:uppercase;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
  font-weight: 500;
  color: white;
  ${({color}) =>
  color &&
  css`
      background-color: ${color};
    `};
  ${({size}) =>
  size &&
  css`
      width: ${size}px;
      height: ${size}px;
    `};
`;

User.Avatar = Avatar;

export { User };
