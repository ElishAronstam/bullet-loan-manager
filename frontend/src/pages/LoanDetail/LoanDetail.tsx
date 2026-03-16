import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_LOAN } from "../../graphql/queries";
import RepaymentTable from "../../components/RepaymentTable";
import {
  Container,
  BackButton,
  LoanName,
  InfoGrid,
  InfoItem,
  Label,
  Value,
  SectionTitle,
} from "./LoanDetail.styles";
import QueryState from "../../components/QueryState";
import type { Loan } from "../../graphql/generated/types";

interface LoanData {
  loan: Loan | null;
}

const LoanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<LoanData>(GET_LOAN, {
    variables: { id },
  });

  const loan = data?.loan;

  return (
    <Container>
      <BackButton onClick={() => navigate("/loans")}>Back to Loans</BackButton>

      <QueryState
        loading={loading}
        error={error}
        empty={!loan}
        emptyMessage="Loan not found."
      >
        {loan && (
          <>
            <LoanName>{loan.name}</LoanName>

            <InfoGrid>
              <InfoItem>
                <Label>Principal</Label>
                <Value>${loan.principal.toLocaleString()}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Start Date</Label>
                <Value>{loan.startDate}</Value>
              </InfoItem>
              <InfoItem>
                <Label>End Date</Label>
                <Value>{loan.endDate}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Interest Rate</Label>
                <Value>{(loan.interestRate * 100).toFixed(2)}%</Value>
              </InfoItem>
              <InfoItem>
                <Label>Total Interest</Label>
                <Value>${loan.totalInterest.toLocaleString()}</Value>
              </InfoItem>
            </InfoGrid>

            <SectionTitle>Repayment Schedule</SectionTitle>
            <RepaymentTable payments={loan.payments} />
          </>
        )}
      </QueryState>
    </Container>
  );
};

export default LoanDetail;
