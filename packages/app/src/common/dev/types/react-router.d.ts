import * as reactRouterDom from 'react-router-dom';

interface ToOptions {
  pathname?: string;
  hash?: string;
  search?: string;
}

interface NavigateProps {
  to: string | ToOptions;
}

declare module 'react-router-dom' {
  export const Navigate: React.FC<NavigateProps>;
  export const Routes: React.FC;
}