import { UserSession, AppConfig } from 'blockstack';
import { popupCenter } from './popup';

const dataVaultURL = 'http://localhost:8080/actions.html';

interface AuthOptions {
  redirectTo: string;
  manifestPath: string;
}

export const authenticate = ({ redirectTo, manifestPath }: AuthOptions) => {
  const appConfig = new AppConfig(
    ['store_write', 'publish_data'],
    document.location.href
  );
  const userSession = new UserSession({ appConfig });
  const authRequest = userSession.makeAuthRequest(
    undefined,
    `${document.location.origin}${redirectTo}`,
    `${document.location.origin}${manifestPath}`
  );

  const height = 584;
  const width = 440;

  popupCenter(
    `${dataVaultURL}?authRequest=${authRequest}`,
    'Continue with Data Vault',
    width,
    height
  );
};
