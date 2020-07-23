import { JSONSchemaForWebApplicationManifestFiles } from '@schemastore/web-manifest';

export interface DecodedAuthRequest {
  public_keys: string;
  domain_name: string;
  manifest_uri: string;
  redirect_uri: string;
  scopes: string[];
  sendToSignIn: boolean;
  appDetails?: {
    name: string;
    icon: string;
  };
  client?: string;
  connectVersion?: string;
}

export type AppManifest = JSONSchemaForWebApplicationManifestFiles;
