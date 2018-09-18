import styled, { keyframes } from 'styled-components'

export const PhotoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  background: #DDD;

  &:after {
    content: '';
    display: block;
    padding-top: 100%;
  }
`
export const PhotoCanvas = styled.canvas`

`
export const PhotoActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`
export const cameraFlashAnimation = keyframes`
  0%, 20% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`
export const CameraFlash = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
  opacity: 0;
  animation: ${cameraFlashAnimation} 500ms ease-out;
`
export const PhotoActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 0 10px;
  background: ${p => p.positive ? 'mediumseagreen' : '#f67b7b'};
  border-radius: 100%;
  border: none;

  svg {
    fill: #FFF;
  }
`
export const PhotoLoader = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
`
