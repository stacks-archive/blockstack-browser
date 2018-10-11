import React from 'react'
import { StyleProvider, Link } from 'mdx-go'
import { ThemeProvider } from 'styled-components'
import { Box, Flex, Type, theme } from '../../src'
import { routes } from '../components/routes'
import { Container } from '../components/styles'
import { code } from './code'

const sidebarWidth = [0, 0, '200px']

const Sidebar = (p) => (
  <Flex
    overflow="hidden"
    is="aside"
    bg={theme.colors.blue.dark}
    color="white"
    style={{
      borderRight: '1px solid',
      borderColor: theme.colors.blue.mid
    }}
    flexDirection="column"
    height={'100vh'}
    alignItems="flex-start"
    justifyContent="flex-start"
    pt={4}
    width={sidebarWidth}
    position="fixed"
    left={0}
    {...p}
  />
)

const SidebarLink = (props) => (
  <Link
    style={{
      display: 'block',
      fontSize: 16,
      textDecoration: 'none',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 4,
      color: 'currentColor'
    }}
    {...props}
  />
)

const Content = ({ children, ...props }) => (
  <Box width={1} ml={sidebarWidth} px={5} {...props}>
    <Box mx="auto" maxWidth="932px" pb={5}>
      {children}
    </Box>
  </Box>
)

const Provider = ({ children }) => (
  <ThemeProvider theme={theme}>
    <StyleProvider
      components={{
        code,
        pre: code
      }}
    >
      {children}
    </StyleProvider>
  </ThemeProvider>
)

export const Root = ({ children, ...rest }) => (
  <Provider>
    <Container>
      <Sidebar>
        {routes.map(({ name, routes: childRoutes }, i) => (
          <>
            {i > 0 ? (
              <Box
                mt={5}
                mb={2}
                width={1}
                height="1px"
                bg="currentColor"
                opacity="0.15"
              />
            ) : null}
            <Box key={i}>
              {name ? (
                <Type
                  color="currentColor"
                  pl={16}
                  pt={4}
                  pb={2}
                  fontWeight="bold"
                >
                  {name}
                </Type>
              ) : null}
              {childRoutes.map(({ name, path }) => (
                <SidebarLink key={path} href={path} children={name} />
              ))}
            </Box>
          </>
        ))}
      </Sidebar>
      <Content width={[1, 1, `calc(100% - 200px)`]}>{children}</Content>
    </Container>
  </Provider>
)
