import { useRef, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "../theme";

interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
}

const InfiniteScroll = ({ hasMore, loading, onLoadMore, children }: InfiniteScrollProps) => {
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
      threshold: 0.1,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <>
      {children}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
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

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 0;
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${theme.colors.accentLight};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 14px;
`;
