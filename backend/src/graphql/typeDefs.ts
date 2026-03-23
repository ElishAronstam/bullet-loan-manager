export const schema = `#graphql
  enum PaymentType {
    Interest
    PrincipalAndInterest
  }

  enum PaymentAllowed{
   ON_WORK_DAY
   PREV
   NEXT
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
    paymentType: PaymentAllowed!
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
    paymentType: PaymentAllowed!
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
