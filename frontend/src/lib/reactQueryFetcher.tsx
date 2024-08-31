import { useQuery, UseQueryResult } from "@tanstack/react-query";
interface UseQueryFetcherProps {
  url: string;
  queryKey: string | string[];
  method: "GET" | "POST" | "PUT" | "DELETE";
}

const useQueryFetcher = ({
  url,
  queryKey,
  method,
}: UseQueryFetcherProps): UseQueryResult => {
  return useQuery({
    queryKey: [queryKey, url],
    staleTime: 1000 * 60 * 5,
    queryFn: async () =>
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
        credentials: "include",
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        return res.json();
      }),
  });
};

export default useQueryFetcher;
