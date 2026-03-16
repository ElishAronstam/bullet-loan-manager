import styled, { keyframes } from "styled-components";
import { theme } from "../theme";
import type { ApolloError } from "@apollo/client";

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

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${theme.colors.accentLight};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-bottom: 12px;
`;

const Message = styled.p`
  color: ${theme.colors.textSecondary};
  text-align: center;
  padding: 0;
  margin: 0;
`;

const ErrorMessage = styled(Message)`
  color: ${theme.colors.error};
`;
