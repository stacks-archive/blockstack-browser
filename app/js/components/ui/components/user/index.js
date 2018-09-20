import React from 'react'
import styled, { css } from 'styled-components'
import CameraIcon from 'mdi-react/CameraIcon'

const User = styled.div``

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  text-transform: uppercase;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  color: white;
  position: relative;
  ${({ textSize }) =>
    textSize &&
    css`
      font-size: ${textSize}px;
    `};
  ${({ color }) =>
    color &&
    css`
      background-color: ${color};
    `};
  ${({ camera }) =>
    camera &&
    css`
      &:hover {
        cursor: pointer;
      }
    `};
  ${({ size }) =>
    size &&
    css`
      width: ${size}px;
      height: ${size}px;
    `};
`
const cameraSize = 28
const Camera = styled.div`
  width: ${cameraSize}px;
  height: ${cameraSize}px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  right: 0;
  background: #010101;
`

const CameraContainer = (props) => (
  <Camera {...props}>
    <CameraIcon color="white" size={14} />
  </Camera>
)

User.Avatar = Avatar
User.Avatar.Camera = CameraContainer

export { User }
