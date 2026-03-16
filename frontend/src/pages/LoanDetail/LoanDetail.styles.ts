import styled from "styled-components";
import { theme } from "../../theme";

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
  background: ${theme.colors.background};
`;

export const BackButton = styled.button`
  padding: 6px 14px;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background: ${theme.colors.surface};
  cursor: pointer;
  font-size: 14px;
  color: ${theme.colors.primary};
  margin-bottom: 24px;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.accentLight};
    border-color: ${theme.colors.accent};
  }
`;

export const LoanName = styled.h1`
  font-size: 24px;
  margin: 0 0 24px;
  color: ${theme.colors.primary};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export const InfoItem = styled.div`
  padding: 14px 16px;
  background: ${theme.colors.surface};
  border-radius: 10px;
  border: 1px solid ${theme.colors.border};
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.accent};
    box-shadow: 0 2px 8px ${theme.colors.accentLight};
  }
`;

export const Label = styled.div`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Value = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 16px;
  color: ${theme.colors.primary};
`;