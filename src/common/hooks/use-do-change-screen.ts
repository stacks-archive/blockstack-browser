import { ScreenPaths } from '@store/common/types';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { currentScreenState } from '@store/onboarding';

type DoChangeScreen = (path: ScreenPaths, changeRoute?: boolean) => void;

export function useDoChangeScreen(): DoChangeScreen {
  const navigate = useNavigate();
  const changeScreen = useSetRecoilState(currentScreenState);

  const doNavigatePage = useCallback(
    (path: ScreenPaths) => {
      navigate(path);
      changeScreen(path);
    },
    [changeScreen, navigate]
  );

  return useCallback(
    (path: ScreenPaths, changeRoute = true) => {
      if (changeRoute) {
        return doNavigatePage(path);
      }
    },
    [doNavigatePage]
  );
}
