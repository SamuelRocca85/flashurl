import type { StatsPayload } from "@/types.d";

export const mockStats: StatsPayload = {
  link: {
    originalUrl: "https://google.com",
    shortUrl: "http://localhost:4000/LKWNDW",
    tags: ["docs", "launch", "promo"],
  },
  stats: {
    totalHits: 12874,
    uniqueVisitors: 9342,
    device: { desktop: 7820, mobile: 5054 },
    avgRedirectLatencyMs: 47.8,
    topCountries: [
      { countryCode: "US", count: 4200 },
      { countryCode: "MX", count: 1900 },
      { countryCode: "HN", count: 1200 },
      { countryCode: "ES", count: 980 },
      { countryCode: "BR", count: 860 },
      { countryCode: "AR", count: 740 },
      { countryCode: "CO", count: 620 },
    ],
    decayCurve: Array.from({ length: 14 }, (_, i) => {
      const base = 1500 - i * 90 + Math.round(Math.random() * 120);
      const day = new Date(Date.now() - (13 - i) * 86400000)
        .toISOString()
        .slice(0, 10);
      return { day, hits: Math.max(80, base) };
    }),
  },
};
