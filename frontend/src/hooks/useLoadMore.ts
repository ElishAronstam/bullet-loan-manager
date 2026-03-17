import { useState, useCallback, useRef } from "react";

export const useClientLoadMore = (totalCount: number, pageSize: number) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const hasMore = visibleCount < totalCount;

  const loadMore = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, totalCount));
      loadingRef.current = false;
      setLoading(false);
    }, 300);
  }, [totalCount, pageSize]);

  return { visibleCount, loading, hasMore, loadMore };
};


export const useServerLoadMore = () => {
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => setPage((p) => p + 1), []);
  const reset = useCallback(() => setPage(1), []);

  return { page, loadMore, reset };
};
