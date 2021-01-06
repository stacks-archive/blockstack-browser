declare module 'zone-file' {
  interface URI {
    target: string;
  }
  export interface ZoneFile {
    $origin: string;
    uri: URI[];
  }

  export const parseZoneFile: (zoneFile: string) => ZoneFile;
}
