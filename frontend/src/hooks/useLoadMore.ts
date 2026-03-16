import { useState, useCallback } from "react";

/** Client-side pagination — slices an already-loaded array with a simulated loading delay. */
export const useClientLoadMore = (totalCount: number, pageSize: number) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);

  const hasMore = visibleCount < totalCount;

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, totalCount));
      setLoading(false);
    }, 300);
  }, [loading, totalCount, pageSize]);

  return { visibleCount, loading, hasMore, loadMore };
};

/** Server-side pagination — increments a page counter. Loading guard is handled by InfiniteScroll. */
export const useServerLoadMore = () => {
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => setPage((p) => p + 1), []);
  const reset = useCallback(() => setPage(1), []);

  return { page, loadMore, reset };
};
