import {
  Container,
  TopRow,
  TitleGroup,
  Title,
  Subtitle,
  ActionButton,
  SearchInput,
} from "./PageHeader.styles";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: PageHeaderProps) => (
  <Container>
    <TopRow>
      <TitleGroup>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </TitleGroup>
      {buttonText && onButtonClick && (
        <ActionButton onClick={onButtonClick}>{buttonText}</ActionButton>
      )}
    </TopRow>
    {onSearchChange && (
      <SearchInput
        type="text"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    )}
  </Container>
);

export default PageHeader;
