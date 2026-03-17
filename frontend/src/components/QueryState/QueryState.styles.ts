import styled, { keyframes } from "styled-components";
import { theme } from "../../theme";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${theme.colors.accentLight};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-bottom: 12px;
`;

export const Message = styled.p`
  color: ${theme.colors.textSecondary};
  text-align: center;
  padding: 0;
  margin: 0;
`;

export const ErrorMessage = styled(Message)`
  color: ${theme.colors.error};
`;
