import api from "./axios";

/**
 * The single fetcher behind every `useSWR` call.
 *
 * Lives apart from SWRProvider so that components can also hand it to SWR's
 * `preload()` without importing the provider module.
 */
const fetcher = async (url) => {
  const res = await api.get(url);
  return res.data;
};

export default fetcher;
