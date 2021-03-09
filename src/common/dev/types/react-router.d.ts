import * as reactRouterDom from 'react-router-dom';

declare module 'react-router-dom' {
  export interface ToOptions {
    pathname?: string;
    hash?: string;
    search?: string;
  }
  export const Routes: React.FC;
  export const useNavigate: () => (to: toOptions) => void;
}
