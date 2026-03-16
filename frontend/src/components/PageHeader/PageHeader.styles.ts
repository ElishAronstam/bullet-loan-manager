import styled from "styled-components";
import { theme } from "../../theme";


export const Container = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  margin-bottom: 24px;
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

export const Action = styled.div`
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
`;
