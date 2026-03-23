import axios from "axios";

export type RateHistory = Map<string, number>;
let cachedHistory: RateHistory = new Map();
let cachedStart = "";
let cachedEnd = "";
let cachedAt = 0;

const CACHE_TTL =
  (parseInt(process.env.PRIME_RATE_CACHE_TTL_DAYS || "30")) *
  24 *
  60 *
  60 *
  1000;

const todayStr = () => new Date().toISOString().split("T")[0];

const isCacheExpired = () => Date.now() - cachedAt > CACHE_TTL;

const getFredParams = () => {
  const url = process.env.FRED_PRIME_RATE_URL;
  const apiKey = process.env.FRED_API_KEY;
  if (!url || !apiKey) {
    throw new Error("Missing FRED_PRIME_RATE_URL or FRED_API_KEY in env");
  }
  return { url, apiKey };
};

const parseObservations = (
  observations: { date: string; value: string }[],
): RateHistory => {
  const history: RateHistory = new Map();
  for (const obs of observations) {
    if (obs.value !== ".") {
      history.set(obs.date, parseFloat(obs.value) / 100);
    }
  }
  return history;
};

const fetchRateRange = async (
  startDate: string,
  endDate: string,
): Promise<RateHistory> => {
  const { url, apiKey } = getFredParams();
  const { data } = await axios.get(url, {
    params: {
      series_id: "DPRIME",
      api_key: apiKey,
      file_type: "json",
      observation_start: startDate,
      observation_end: endDate,
    },
  });
  return parseObservations(data.observations);
};

const fetchLatestRate = async (): Promise<number> => {
  const { url, apiKey } = getFredParams();
  const { data } = await axios.get(url, {
    params: {
      series_id: "DPRIME",
      api_key: apiKey,
      file_type: "json",
      sort_order: "desc",
      limit: 1,
    },
  });

  const value = data.observations[0]?.value;
  if (!value || value === ".") {
    throw new Error("No current prime rate found in FRED data");
  }
  return parseFloat(value) / 100;
};

export const getCurrentPrimeRate = async (): Promise<number> => {
  if (!isCacheExpired() && cachedHistory.size > 0) {
    const rate = [...cachedHistory.values()].pop()!;
    console.log(`Current rate cache hit: ${rate}`);
    return rate;
  }

  console.log("Fetching current prime rate from FRED");
  const rate = await fetchLatestRate();

  const today = todayStr();
  cachedHistory = new Map([[today, rate]]);
  cachedStart = today;
  cachedEnd = today;
  cachedAt = Date.now();

  console.log(`Current prime rate: ${rate}`);
  return rate;
};

export const fetchPrimeRateHistory = async (
  startDate: string,
  endDate: string,
): Promise<RateHistory> => {
  const today = todayStr();
  const endCap = endDate > today ? today : endDate;

  const isCovered =
    !isCacheExpired() &&
    cachedHistory.size > 0 &&
    cachedStart <= startDate &&
    cachedEnd >= endCap;

  if (isCovered) {
    console.log(`Rate history cache hit (${startDate} → ${endCap})`);
    return cachedHistory;
  }

  const fetchStart =
    !isCacheExpired() && cachedStart && cachedStart < startDate
      ? cachedStart
      : startDate;
  const fetchEnd =
    !isCacheExpired() && cachedEnd && cachedEnd > endCap ? cachedEnd : endCap;

  console.log(`Fetching FRED rate history (${fetchStart} → ${fetchEnd})`);
  const history = await fetchRateRange(fetchStart, fetchEnd);

  if (history.size === 0) {
    throw new Error("No prime rate observations found in FRED data");
  }

  cachedHistory = history;
  cachedStart = fetchStart;
  cachedEnd = fetchEnd;
  cachedAt = Date.now();

  console.log(`Cached ${history.size} rate observations`);
  return cachedHistory;
};
