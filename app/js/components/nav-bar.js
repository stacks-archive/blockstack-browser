import React from 'react'
import { Box, Flex, Type } from 'blockstack-ui'
import { AppsIcon, AccountIcon, WalletIcon, SettingsIcon } from 'mdi-react'

const NavItem = ({ active, icon: Icon, label, ...rest }) => {
  const color = active ? 'blue.dark' : 'blue.medium'
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={4}
      {...rest}
    >
      <Box color={color}>
        <Icon color="currentColor" />
      </Box>
      <Box color={color}>
        <Type fontWeight="600">{label}</Type>
      </Box>
    </Flex>
  )
}
const Navbar = ({ ...rest }) => {
  return (
    <Flex
      top={0}
      width={1}
      left={0}
      bg="white"
      borderBottom="1px solid"
      borderColor="blue.mid"
      position="fixed"
      height="84px"
      alignItems="center"
      justifyContent="space-between"
      px={4}
      zIndex={9999}
      boxShadow="card"
    >
      <Flex>
        <NavItem active icon={AppsIcon} label="Apps" />
      </Flex>

      <Flex>
        <NavItem icon={AccountIcon} label="IDs" />
        <NavItem icon={WalletIcon} label="Wallet" />
        <NavItem icon={SettingsIcon} label="Settings" />
      </Flex>
    </Flex>
  )
}

export { Navbar }
