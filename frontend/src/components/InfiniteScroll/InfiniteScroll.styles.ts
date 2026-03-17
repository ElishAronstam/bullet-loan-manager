import styled, { keyframes } from "styled-components";
import { theme } from "../../theme";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 0;
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${theme.colors.accentLight};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 14px;
`;
