export type LinkInfo = {
  originalUrl: string;
  shortUrl: string;
  tags: string[];
};

export type DeviceSplit = {
  desktop: number;
  mobile: number;
};

export type CountryHit = {
  countryCode: string;
  count: number;
};

export type DecayPoint = {
  day: string;
  hits: number;
};

export type Stats = {
  totalHits: number;
  uniqueVisitors: number;
  device: DeviceSplit;
  avgRedirectLatencyMs: number;
  topCountries: CountryHit[];
  decayCurve: DecayPoint[];
};

export type StatsPayload = {
  link: LinkInfo;
  stats: Stats;
};
