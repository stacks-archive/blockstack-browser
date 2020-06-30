export interface State {
  mobileMenu: boolean;
  activeSlug: string;
  slugInView?: string;
  version?: string;
  setState: (value: any) => void;
}
