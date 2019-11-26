export interface DecodedAuthRequest {
  public_keys: string;
  domain_name: string;
  manifest_uri: string;
  redirect_uri: string;
  scopes: string[];
}

interface AppManifestIcon {
  src: string;
  sizes: string;
  type: string;
}

export interface AppManifest {
  name: string;
  start_url: string;
  description: string;
  icons: AppManifestIcon[];
}
