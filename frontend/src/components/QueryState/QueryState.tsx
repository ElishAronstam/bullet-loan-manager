import type { ApolloError } from "@apollo/client";
import { LoadingContainer, Spinner, Message, ErrorMessage } from "./QueryState.styles";

interface QueryStateProps {
  loading: boolean;
  error?: ApolloError;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

const QueryState = ({ loading, error, empty, emptyMessage, children }: QueryStateProps) => {
  if (loading)
    return (
      <LoadingContainer>
        <Spinner />
        <Message>Loading...</Message>
      </LoadingContainer>
    );
  if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;
  if (empty) return <Message>{emptyMessage || "No data found."}</Message>;
  return <>{children}</>;
};

export default QueryState;
