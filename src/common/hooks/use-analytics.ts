import { useSelector, useDispatch } from 'react-redux';
import { selectDecodedAuthRequest } from '@store/onboarding/selectors';
import { doTrack as track, doTrackScreenChange } from '@common/track';
import { doChangeScreen as changeScreen } from '@store/onboarding/actions';
import { ScreenPaths } from '@store/onboarding/types';
import { useAppDetails } from './useAppDetails';
import { useNavigate } from 'react-router-dom';

export const useAnalytics = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doNavigatePage = (path: ScreenPaths) => {
    navigate(path);
    dispatch(changeScreen(path));
  };
  const authRequest = useSelector(selectDecodedAuthRequest);
  const { name, url } = useAppDetails();

  const getAppDetails = () => {
    return {
      appName: name,
      appDomain: url?.host,
    };
  };

  const doTrack = (type: string, payload?: object) => {
    track(type, {
      ...payload,
      ...getAppDetails(),
    });
  };

  const doChangeScreen = (path: ScreenPaths, changeRoute = true) => {
    doTrackScreenChange(path, authRequest);
    if (changeRoute) {
      return doNavigatePage(path);
    }
  };

  return { doTrack, doChangeScreen };
};
