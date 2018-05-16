import styled, { css } from 'styled-components'
import { spacing } from '@ui/common/constants'

const paddingStyles = css`
  ${({ padding }) =>
    padding &&
    css`
      padding: ${padding};
    `};
`

const Type = styled.div``

const p = styled.p`
  line-height: 28px;
  font-size: 16px;
  color: ${({ color }) => (color ? color : 'rgba(39, 16, 51, 0.7)')};
  padding: 0;
  margin: 0;
  strong {
    font-weight: 500;
    color: ${({ color }) => (color ? color : 'rgba(39, 16, 51, 0.9)')};
  }
  ${paddingStyles};
  & + & {
    margin-top: ${spacing.base};
  }
`

const Small = styled.span`
  line-height: 24px;
  display: inline-block;
  font-size: 14px;
  color: rgba(39, 15, 52, 0.7);
  ${paddingStyles};
  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `};
`

const h1 = styled.h1`
  font-weight: 300;
  line-height: 38px;
  font-size: 28px;
  color: #271033;
  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `};

  ${paddingStyles};

  margin: 0;
`
const h2 = styled.h2`
  font-weight: 300;
  line-height: 34px;
  font-size: 24px;
  color: #271033;
  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `};

  ${paddingStyles};

  margin: 0;
`

const h3 = styled.h3`
  font-style: normal;
  font-weight: normal;
  line-height: 24px;
  font-size: 18px;
  color: #271033;
  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `};

  ${paddingStyles};

  margin: 0;
`
const h5 = styled.h5`
  font-style: normal;
  font-weight: 500;
  line-height: 23px;
  font-size: 14px;
  text-align: right;

  color: rgba(39, 15, 52, 0.4);

  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `};

  ${paddingStyles};

  margin: 0;
`

Type.p = p
Type.small = Small
Type.h1 = h1
Type.h2 = h2
Type.h3 = h3
Type.h5 = h5

export { Type }
