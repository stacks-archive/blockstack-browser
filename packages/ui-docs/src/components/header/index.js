import React from "react";
import { Box, Flex, Text } from "@blockstack/ui";
import MenuIcon from "mdi-react/MenuIcon";
import CloseIcon from "mdi-react/CloseIcon";
import GithubCircleIcon from "mdi-react/GithubCircleIcon";
import { useMobileMenuState } from "../app-state";
import { SideNav } from "../side-nav";

const MenuButton = ({ ...rest }) => {
  const { isOpen, handleOpen, handleClose } = useMobileMenuState();
  const Icon = isOpen ? CloseIcon : MenuIcon;
  const handleClick = isOpen ? handleClose : handleOpen;
  return (
    <Flex display={["flex", "flex", "none"]} onClick={handleClick} px={1}>
      <Icon color="currentColor" />
    </Flex>
  );
};

const GithubButton = ({ ...rest }) => {
  return <Flex></Flex>;
};

const Header = ({ ...rest }) => {
  const { isOpen, handleClose } = useMobileMenuState();

  return (
    <>
      <Flex
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="ink.100"
        py={3}
        px={[6, 6, 3]}
        position="fixed"
        width="100%"
        bg="white"
        zIndex="99"
        height="50px"
      >
        <Text fontWeight="medium">Waffle Design System</Text>
        <MenuButton />
      </Flex>
      <SideNav
        position="fixed"
        top="50px"
        maxHeight="calc(100vh - 50px)"
        bg="white"
        width="100%"
        zIndex="99"
        display={isOpen ? ["block", "block", "none"] : "none"}
      />
    </>
  );
};

export { Header };
