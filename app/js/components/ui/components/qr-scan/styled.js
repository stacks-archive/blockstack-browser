import styled, { keyframes } from 'styled-components'

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: -10px;
  right: -10px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #FFF;
`

export const Scanner = styled.div`
  position: relative;
  margin: 0 auto 1rem;
  width: 75%;
  overflow: hidden;
`

export const ButtonWrap = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ErrorPop = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
`

export const ErrorMessage = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.5rem;
  font-size: 0.9rem;
  background: #F67B7B;
  color: #FFF;
  z-index: 1;
  animation: ${ErrorPop} 300ms ease;
  z-index: 1000;
  text-align: center;
`
