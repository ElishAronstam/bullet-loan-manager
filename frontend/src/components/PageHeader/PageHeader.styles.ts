import styled from "styled-components";
import { theme } from "../../theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const TopRow = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
`;

export const TitleGroup = styled.div`
  text-align: center;
  grid-column: 1;
  grid-row: 1;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin: 4px 0 0;
`;

export const ActionButton = styled.button`
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
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

export const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
`;
