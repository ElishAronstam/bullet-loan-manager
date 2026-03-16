import styled from "styled-components";
import { theme } from "../../theme";

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
  background: ${theme.colors.background};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 16px;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
`;

export const NewLoanButton = styled.button`
  padding: 10px 20px;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px ${theme.colors.accentLight};
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.primaryHover};
    box-shadow: 0 4px 12px ${theme.colors.accent}40;
    transform: translateY(-1px);
  }
`;