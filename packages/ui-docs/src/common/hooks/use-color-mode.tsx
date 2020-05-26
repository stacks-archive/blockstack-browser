import { useContext } from 'react';
import { ColorModeContext } from '@components/color-modes';

export const useColorMode = () => {
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);
  return { colorMode, toggleColorMode };
};
