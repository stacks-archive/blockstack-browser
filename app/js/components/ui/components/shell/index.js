import styled, { css } from 'styled-components'
import { animated } from 'react-spring/dist/react-spring.umd'
import { spacing } from '@ui/common/constants'

const Loading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  z-index: 99;
`

const Header = styled.div``
const Title = styled.div`
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  margin-bottom: ${spacing.gutter};
  display: flex;
`
const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:not(:first-of-type):last-of-type {
    padding-left: ${spacing.base};
  }
`
const AnimatedTitle = styled(animated.div)``
const Content = styled(animated.div)`
  flex-grow: ${({ grow }) => (grow ? 1 : 0)};
`
const Actions = styled(animated.div)`
  @media (max-width: 900px) {
    margin-bottom: 30px;
  }
`

const Main = styled(animated.div)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`
const Wrapper = styled(animated.div)`
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  flex-grow: 1;
  &:first-of-type {
    z-index: 20;
  }
`

const StyledShell = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  min-height: ${({ height }) => (height > 0 ? `${height}px` : '100vh')};
  top: 0;
  left: 0;
  width: 100%;
  z-index: 900000;
  background: white;
  @media (max-width: 900px) {
    max-height: 100vh;
    overflow-y: auto;
    margin-bottom: 30px;
  }
  * {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI',
      Roboto, sans-serif;
  }
  * {
    box-sizing: border-box;
  }

  @media (max-width: 900px) {
    ${({ invert }) =>
      invert &&
      css`
        background: linear-gradient(97.35deg, #382c68 0%, #7858a2 173.24%);

        ${Wrapper} {
          background: white;
          border-radius: 8px;
        }
        ${Title}, ${Actions} {
          padding: ${spacing.gutter};
        }

        ${Content} {
          padding: 0 ${spacing.gutter};
        }

        ${Title} {
          border-bottom: 1px solid rgba(39, 15, 52, 0.1);
        }
      `};
  }
`

const Sidebar = styled.div`
  position: relative;
  width: 342px;
  min-width: 342px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  padding: ${spacing.gutter};
  background-image: linear-gradient(97.35deg, #382c68 0%, #7858a2 173.24%);
  @media (max-width: 900px) {
    display: none;
  }
`

const SidebarLogo = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
`

const SidebarContent = styled.div`
  min-height: 400px;
  h1 {
    margin-bottom: ${spacing.gutter};
  }
`

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
  padding: ${spacing.gutter};

  @media (max-width: 900px) {
    padding-bottom: 0;
  }
  @media (min-width: 900px) {
    padding: calc(${spacing.gutter} * 2);
    max-width: 720px;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  }
`
const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  ${Wrapper} {
    position: relative;
    @media (min-width: 900px) {
      min-height: 500px;
    }
  }
`

StyledShell.Header = Header
StyledShell.Title = Title
StyledShell.Title.Section = TitleSection
StyledShell.Title.Animated = AnimatedTitle
StyledShell.Content = Content
StyledShell.Actions = Actions
StyledShell.Main = Main
StyledShell.Wrapper = Wrapper
StyledShell.Loading = Loading
StyledShell.Sidebar = Sidebar
StyledShell.Sidebar.Logo = SidebarLogo
StyledShell.Sidebar.Content = SidebarContent
StyledShell.Content.Container = ContentContainer
StyledShell.Content.Wrapper = ContentWrapper

export { StyledShell }
