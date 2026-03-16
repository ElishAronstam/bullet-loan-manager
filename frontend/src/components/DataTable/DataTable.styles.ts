import styled from "styled-components";
import { theme } from "../../theme";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th<{ $sortable?: boolean }>`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid ${theme.colors.border};
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: ${(p) => (p.$sortable ? "pointer" : "default")};
  user-select: none;
  transition: color 0.2s;

  &:hover {
    color: ${(p) => (p.$sortable ? theme.colors.primaryHover : theme.colors.primary)};
  }
`;

export const SortIndicator = styled.span`
  margin-left: 4px;
  font-size: 11px;
`;

export const Row = styled.tr<{ isClickable: boolean }>`
  cursor: ${(p) => (p.isClickable ? "pointer" : "default")};
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.accentLight};
  }
`;

export const TableData = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid ${theme.colors.borderLight};
  font-size: 14px;
  color: ${theme.colors.text};
`;
