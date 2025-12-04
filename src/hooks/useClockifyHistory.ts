import { useInfiniteQuery } from "@tanstack/react-query";
import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { getHistory } from "../lib/firebaseFunctions";

interface HistoryEntry {
  id: string;
  label: string;
  duration: number;
  completedAt: string;
  projectName: string | null;
}

interface HistoryPage {
  history: HistoryEntry[];
  needsConfiguration: boolean;
  hasMore: boolean;
}

const PAGE_SIZE = 30; // Max entries per request

export const useClockifyHistory = (): UseInfiniteQueryResult<
  {
    pages: HistoryPage[];
    pageParams: (string | undefined)[];
  },
  Error
> => {
  return useInfiniteQuery({
    queryKey: ["history"],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      // pageParam is the date of the last loaded entry
      // If undefined, this is the first page (load from now)

      const result = await getHistory(
        pageParam
          ? { lastDate: pageParam, pageSize: PAGE_SIZE }
          : { pageSize: PAGE_SIZE },
      );

      return {
        history: result.history as HistoryEntry[],
        needsConfiguration: result.needsConfiguration || false,
        hasMore: result.history.length > 0,
      };
    },
    getNextPageParam: (lastPage) => {
      // If configuration needed, no more pages
      if (lastPage.needsConfiguration) return undefined;

      // If no entries in last page, stop
      if (lastPage.history.length === 0) return undefined;

      // Get the oldest entry's date to use as cursor for next page
      const oldestEntry = lastPage.history[lastPage.history.length - 1];
      const nextCursor = oldestEntry.completedAt;

      return nextCursor;
    },
    initialPageParam: undefined, // Start from now
  });
};
