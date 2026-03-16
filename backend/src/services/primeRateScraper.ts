import axios from "axios";

export type RateHistory = Map<string, number>; // date → rate (e.g. "2024-12-19" → 0.075)

let cachedRates: RateHistory = new Map();
let cachedStart = "";
let cachedEnd = "";

const getFredParams = () => {
  const url = process.env.FRED_PRIME_RATE_URL;
  const apiKey = process.env.FRED_API_KEY;
  if (!url || !apiKey) {
    throw new Error("Missing FRED_PRIME_RATE_URL or FRED_API_KEY in env");
  }
  return { url, apiKey };
};

const fetchFromFred = async (
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

  const history: RateHistory = new Map();
  for (const obs of data.observations) {
    if (obs.value !== ".") {
      history.set(obs.date, Number((parseFloat(obs.value) / 100).toFixed(2)));
    }
  }
  return history;
};

// Fetches prime rate history from FRED for a given date range.
// Expands the cache if the requested range extends beyond what's already cached.
export const fetchPrimeRateHistory = async (
  startDate: string,
  endDate: string,
): Promise<RateHistory> => {
  const isCovered =
    cachedRates.size > 0 && cachedStart <= startDate && cachedEnd >= endDate;

  if (isCovered) {
    console.log(`Rate history cache hit (${startDate} → ${endDate})`);
    return cachedRates;
  }

  // Expand range to cover both old cache and new request
  const fetchStart =
    cachedStart && cachedStart < startDate ? cachedStart : startDate;
  const fetchEnd = cachedEnd && cachedEnd > endDate ? cachedEnd : endDate;

  console.log(`Fetching FRED rates (${fetchStart} → ${fetchEnd})`);
  const history = await fetchFromFred(fetchStart, fetchEnd);

  if (history.size === 0) {
    console.error("No prime rate observations returned from FRED");
    throw new Error("No prime rate observations found in FRED data");
  }

  console.log(`Cached ${history.size} rate observations`);
  cachedRates = history;
  cachedStart = fetchStart;
  cachedEnd = fetchEnd;
  return cachedRates;
};

// Returns the most recent prime rate, from cache or a single API call.
export const getCurrentPrimeRate = async (): Promise<number> => {
  if (cachedRates.size > 0) {
    console.log("Using cached current prime rate");
    return [...cachedRates.values()].pop()!;
  }

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
    console.error("No current prime rate in FRED response");
    throw new Error("No current prime rate found");
  }

  return Number((parseFloat(value) / 100).toFixed(2));
};
