import { useSelector } from 'react-redux';
import { selectDecodedAuthRequest } from '@store/onboarding/selectors';
import { doTrack as track, doTrackScreenChange } from '@common/track';
import { doChangeScreen as changeScreen } from '@store/onboarding/actions';
import { ScreenName } from '@store/onboarding/types';

export const useAnalytics = () => {
  const authRequest = useSelector(selectDecodedAuthRequest);

  const getAppDetails = () => {
    const appURL = authRequest ? new URL(authRequest?.redirect_uri) : null;
    return {
      appName: authRequest?.appDetails?.name,
      appDomain: appURL?.host,
    };
  };

  const doTrack = (type: string, payload?: object) => {
    track(type, {
      ...payload,
      ...getAppDetails(),
    });
  };

  const doChangeScreen = (screen: ScreenName) => {
    doTrackScreenChange(screen, authRequest);
    return changeScreen(screen);
  };

  return { doTrack, doChangeScreen };
};
