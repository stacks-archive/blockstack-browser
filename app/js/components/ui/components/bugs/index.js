import styled, { css } from 'styled-components'
const BugContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Bug = styled.div`
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  width: 100%;
  ${({ size }) =>
    size &&
    css`
      width: ${size}px;
      height: ${size}px;
    `};
  img,
  svg {
    display: block;
    position: absolute;
    width: 100%;
  }
`

const Arrows = styled.div`
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  svg {
    * {
      fill: currentColor;
    }
    display: block;
  }
`

Bug.Container = BugContainer
Bug.Arrows = Arrows

export { Bug }
