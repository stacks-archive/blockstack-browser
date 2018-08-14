import React from 'react'
import PropTypes from 'prop-types'
import QrReader from 'react-qr-reader'
import { StyledButton } from '@ui/components/button'
import * as Styled from './styled'

const QrScan = ({ onScan, onError, handleClose, error }) => (
  <Styled.Container>
    <Styled.Scanner>
      <QrReader
        onScan={(data) => data && onScan(data)}
        onError={onError}
      />
      {error &&
        <Styled.ErrorMessage>{error}</Styled.ErrorMessage>
      }
    </Styled.Scanner>
    <Styled.ButtonWrap>
      <StyledButton height={44} onClick={handleClose}>
        <StyledButton.Label>Stop scanning</StyledButton.Label>
      </StyledButton>
    </Styled.ButtonWrap>
  </Styled.Container>
)

QrScan.propTypes = {
  onScan: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  error: PropTypes.node
}

export default QrScan
