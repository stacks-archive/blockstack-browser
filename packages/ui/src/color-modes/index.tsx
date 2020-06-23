import React, { useEffect, useCallback } from 'react';
import { useMediaQuery } from '../hooks/use-media-query';
import { ColorModes } from './styles';
export * from './utils';
export * from './types';
export * from './styles';

export const ColorModeContext = React.createContext<{ colorMode?: string; toggleColorMode?: any }>({
  colorMode: undefined,
});

export const ColorModeProvider = ({
  colorMode,
  children,
  onChange,
}: {
  colorMode?: string;
  children: any;
  onChange?: (mode: string) => void;
}) => {
  const [mode, setMode] = React.useState(colorMode);
  const [darkmode] = useMediaQuery('(prefers-color-scheme: dark)');
  const [lightmode] = useMediaQuery('(prefers-color-scheme: light)');

  useEffect(() => {
    if (!mode) {
      setMode(darkmode ? 'dark' : 'light');
    }
  }, [mode, darkmode, lightmode]);

  const setColorMode = useCallback(
    (mode: 'light' | 'dark') => {
      setMode(mode);
      onChange && onChange(mode);
    },
    [mode]
  );

  const toggleColorMode = useCallback(() => {
    if (mode === 'light') {
      setColorMode('dark');
      return;
    }
    if (mode === 'dark') {
      setColorMode('light');
      return;
    }
    if (!colorMode && darkmode) {
      setColorMode('light');
      return;
    }
    if (!mode && lightmode) {
      setColorMode('dark');
      return;
    }
  }, [mode, lightmode, darkmode]);

  return (
    <ColorModeContext.Provider value={{ colorMode: mode, toggleColorMode }}>
      <ColorModes colorMode={mode} />
      {children}
    </ColorModeContext.Provider>
  );
};
