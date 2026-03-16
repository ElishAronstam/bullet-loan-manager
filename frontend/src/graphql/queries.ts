import { gql } from "@apollo/client";

export const GET_LOANS = gql`
  query GetLoans($page: Int, $pageSize: Int, $searchText: String, $sortBy: String, $sortOrder: SortOrder) {
    loans(page: $page, pageSize: $pageSize, searchText: $searchText, sortBy: $sortBy, sortOrder: $sortOrder) {
      loans {
        id
        name
        principal
        startDate
        totalInterest
      }
      loansCount
    }
  }
`;

export const GET_LOAN = gql`
  query GetLoan($id: ID!) {
    loan(id: $id) {
      id
      name
      principal
      startDate
      endDate
      interestRate
      totalInterest
      payments {
        id
        paymentDate
        paymentType
        principal
        interest
        total
        remainingBalance
      }
    }
  }
`;
