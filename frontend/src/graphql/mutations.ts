import { gql } from "@apollo/client";

export const CREATE_LOAN = gql`
  mutation CreateLoan($input: LoanInput!) {
    createLoan(input: $input) {
      id
      name
      principal
      startDate
      totalInterest
    }
  }
`;
