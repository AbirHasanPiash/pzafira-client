// src/SWRProvider.jsx
import { SWRConfig } from "swr";
import api from "./api/axios";

// Global fetcher for all useSWR hooks
const fetcher = async (url) => {
  const res = await api.get(url);
  return res.data;
};

export default function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false, // don't refetch when user switches tabs
        dedupingInterval: 1000 * 60 * 5, // 5 min cache validity
        keepPreviousData: true, // smoother transitions between pages
        suspense: false, // avoid suspense-based loading (optional)
        errorRetryCount: 1, // retry once on failure
      }}
    >
      {children}
    </SWRConfig>
  );
}
