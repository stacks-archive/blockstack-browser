export interface State {
  mobileMenu: boolean;
  activeSlug: string;
  version?: string;
  setState: (value: any) => void;
}
