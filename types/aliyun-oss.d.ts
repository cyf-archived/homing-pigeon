export interface Release {
  version?: string;
  prefix?: string;
}

export interface Package {
  etag?: string;
  name?: string;
  short_name?: string;
  url?: string;
  size?: number;
}
