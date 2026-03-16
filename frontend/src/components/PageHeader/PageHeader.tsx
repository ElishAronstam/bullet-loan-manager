import {
  Container,
  TitleGroup,
  Title,
  Subtitle,
  Action,
} from "./PageHeader.styles";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <Container>
    <TitleGroup>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </TitleGroup>
    {action && <Action>{action}</Action>}
  </Container>
);

export default PageHeader;