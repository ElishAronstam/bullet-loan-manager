export const schema = `#graphql
  enum PaymentType {
    Interest
    PrincipalAndInterest
  }

  type Payment {
    id: ID!
    paymentDate: String!
    paymentType: PaymentType!
    principal: Float!
    interest: Float!
    total: Float!
    remainingBalance: Float!
  }

  type Loan {
    id: ID!
    name: String!
    principal: Float!
    startDate: String!
    endDate: String!
    interestRate: Float!
    totalInterest: Float!
    payments: [Payment!]!
  }

  type LoanPage {
    loans: [Loan!]!
    loansCount: Int!
  }

  input LoanInput {
    name: String!
    principal: Float!
    startDate: String!
    endDate: String!
  }

  enum SortOrder {
    ASC
    DESC
  }

  type Query {
    loans(page: Int, pageSize: Int, searchText: String, sortBy: String, sortOrder: SortOrder): LoanPage!
    loan(id: ID!): Loan
  }

  type Mutation {
    createLoan(input: LoanInput!): Loan!
  }
`;
