import { useContext } from 'react';
import { ColorModeContext } from '../color-modes';

export const useColorMode = () => {
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);
  return { colorMode, toggleColorMode };
};
