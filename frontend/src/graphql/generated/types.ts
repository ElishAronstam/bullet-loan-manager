import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Loan = {
  __typename?: 'Loan';
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  interestRate: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  payments: Array<Payment>;
  principal: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
  totalInterest: Scalars['Float']['output'];
};

export type LoanInput = {
  endDate: Scalars['String']['input'];
  name: Scalars['String']['input'];
  principal: Scalars['Float']['input'];
  startDate: Scalars['String']['input'];
};

export type LoanPage = {
  __typename?: 'LoanPage';
  loans: Array<Loan>;
  loansCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createLoan: Loan;
};


export type MutationCreateLoanArgs = {
  input: LoanInput;
};

export type Payment = {
  __typename?: 'Payment';
  id: Scalars['ID']['output'];
  interest: Scalars['Float']['output'];
  paymentDate: Scalars['String']['output'];
  paymentType: PaymentType;
  principal: Scalars['Float']['output'];
  remainingBalance: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export enum PaymentType {
  Interest = 'Interest',
  PrincipalAndInterest = 'PrincipalAndInterest'
}

export type Query = {
  __typename?: 'Query';
  loan?: Maybe<Loan>;
  loans: LoanPage;
};


export type QueryLoanArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLoansArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type CreateLoanMutationVariables = Exact<{
  input: LoanInput;
}>;


export type CreateLoanMutation = { __typename?: 'Mutation', createLoan: { __typename?: 'Loan', id: string, name: string, principal: number, startDate: string, totalInterest: number } };

export type GetLoansQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
}>;


export type GetLoansQuery = { __typename?: 'Query', loans: { __typename?: 'LoanPage', loansCount: number, loans: Array<{ __typename?: 'Loan', id: string, name: string, principal: number, startDate: string, totalInterest: number }> } };

export type GetLoanQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLoanQuery = { __typename?: 'Query', loan?: { __typename?: 'Loan', id: string, name: string, principal: number, startDate: string, endDate: string, interestRate: number, totalInterest: number, payments: Array<{ __typename?: 'Payment', id: string, paymentDate: string, paymentType: PaymentType, principal: number, interest: number, total: number, remainingBalance: number }> } | null };


export const CreateLoanDocument = gql`
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
export type CreateLoanMutationFn = Apollo.MutationFunction<CreateLoanMutation, CreateLoanMutationVariables>;

/**
 * __useCreateLoanMutation__
 *
 * To run a mutation, you first call `useCreateLoanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLoanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLoanMutation, { data, loading, error }] = useCreateLoanMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLoanMutation(baseOptions?: Apollo.MutationHookOptions<CreateLoanMutation, CreateLoanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLoanMutation, CreateLoanMutationVariables>(CreateLoanDocument, options);
      }
export type CreateLoanMutationHookResult = ReturnType<typeof useCreateLoanMutation>;
export type CreateLoanMutationResult = Apollo.MutationResult<CreateLoanMutation>;
export type CreateLoanMutationOptions = Apollo.BaseMutationOptions<CreateLoanMutation, CreateLoanMutationVariables>;
export const GetLoansDocument = gql`
    query GetLoans($page: Int, $pageSize: Int, $searchText: String, $sortBy: String, $sortOrder: SortOrder) {
  loans(
    page: $page
    pageSize: $pageSize
    searchText: $searchText
    sortBy: $sortBy
    sortOrder: $sortOrder
  ) {
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

/**
 * __useGetLoansQuery__
 *
 * To run a query within a React component, call `useGetLoansQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoansQuery({
 *   variables: {
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *      searchText: // value for 'searchText'
 *      sortBy: // value for 'sortBy'
 *      sortOrder: // value for 'sortOrder'
 *   },
 * });
 */
export function useGetLoansQuery(baseOptions?: Apollo.QueryHookOptions<GetLoansQuery, GetLoansQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLoansQuery, GetLoansQueryVariables>(GetLoansDocument, options);
      }
export function useGetLoansLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLoansQuery, GetLoansQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLoansQuery, GetLoansQueryVariables>(GetLoansDocument, options);
        }
// @ts-ignore
export function useGetLoansSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLoansQuery, GetLoansQueryVariables>): Apollo.UseSuspenseQueryResult<GetLoansQuery, GetLoansQueryVariables>;
export function useGetLoansSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLoansQuery, GetLoansQueryVariables>): Apollo.UseSuspenseQueryResult<GetLoansQuery | undefined, GetLoansQueryVariables>;
export function useGetLoansSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLoansQuery, GetLoansQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLoansQuery, GetLoansQueryVariables>(GetLoansDocument, options);
        }
export type GetLoansQueryHookResult = ReturnType<typeof useGetLoansQuery>;
export type GetLoansLazyQueryHookResult = ReturnType<typeof useGetLoansLazyQuery>;
export type GetLoansSuspenseQueryHookResult = ReturnType<typeof useGetLoansSuspenseQuery>;
export type GetLoansQueryResult = Apollo.QueryResult<GetLoansQuery, GetLoansQueryVariables>;
export const GetLoanDocument = gql`
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

/**
 * __useGetLoanQuery__
 *
 * To run a query within a React component, call `useGetLoanQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoanQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLoanQuery(baseOptions: Apollo.QueryHookOptions<GetLoanQuery, GetLoanQueryVariables> & ({ variables: GetLoanQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLoanQuery, GetLoanQueryVariables>(GetLoanDocument, options);
      }
export function useGetLoanLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLoanQuery, GetLoanQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLoanQuery, GetLoanQueryVariables>(GetLoanDocument, options);
        }
// @ts-ignore
export function useGetLoanSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLoanQuery, GetLoanQueryVariables>): Apollo.UseSuspenseQueryResult<GetLoanQuery, GetLoanQueryVariables>;
export function useGetLoanSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLoanQuery, GetLoanQueryVariables>): Apollo.UseSuspenseQueryResult<GetLoanQuery | undefined, GetLoanQueryVariables>;
export function useGetLoanSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLoanQuery, GetLoanQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLoanQuery, GetLoanQueryVariables>(GetLoanDocument, options);
        }
export type GetLoanQueryHookResult = ReturnType<typeof useGetLoanQuery>;
export type GetLoanLazyQueryHookResult = ReturnType<typeof useGetLoanLazyQuery>;
export type GetLoanSuspenseQueryHookResult = ReturnType<typeof useGetLoanSuspenseQuery>;
export type GetLoanQueryResult = Apollo.QueryResult<GetLoanQuery, GetLoanQueryVariables>;