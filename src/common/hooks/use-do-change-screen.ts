import { useDispatch } from 'react-redux';
import { doChangeScreen as changeScreen } from '@store/onboarding/actions';
import { ScreenPaths } from '@store/onboarding/types';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

type DoChangeScreen = (path: ScreenPaths, changeRoute?: boolean) => void;

export function useDoChangeScreen(): DoChangeScreen {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const doNavigatePage = useCallback(
    (path: ScreenPaths) => {
      navigate(path);
      dispatch(changeScreen(path));
    },
    [dispatch, navigate]
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
