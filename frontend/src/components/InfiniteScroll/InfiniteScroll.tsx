import { useRef, useEffect, useCallback } from "react";
import {
  LoadingContainer,
  Spinner,
  LoadingText,
} from "./InfiniteScroll.styles";

interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
}

const InfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
  children,
}: InfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <>
      {children}
      {hasMore && <div ref={sentinelRef} style={{ height: 20 }} />}
      {loading && (
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading more...</LoadingText>
        </LoadingContainer>
      )}
    </>
  );
};

export default InfiniteScroll;
