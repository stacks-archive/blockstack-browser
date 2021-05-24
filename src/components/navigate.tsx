import React, { useEffect } from 'react';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/common/types';
import { useNavigate, ToOptions } from 'react-router-dom';

interface NavigateProps {
  to: string | ToOptions;
  screenPath: ScreenPaths;
}

export const Navigate: React.FC<NavigateProps> = ({ to, screenPath }) => {
  const doChangeScreen = useDoChangeScreen();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
    doChangeScreen(screenPath, false);
  }, [screenPath, doChangeScreen, to, navigate]);

  return null;
};
