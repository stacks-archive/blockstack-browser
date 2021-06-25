import { ScreenPaths } from '@common/types';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

import { currentScreenState } from '@store/onboarding';
import { useUpdateAtom } from 'jotai/utils';

type DoChangeScreen = (path: ScreenPaths, changeRoute?: boolean) => void;

export function useDoChangeScreen(): DoChangeScreen {
  const navigate = useNavigate();
  const changeScreen = useUpdateAtom(currentScreenState);

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
