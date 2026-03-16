import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Loan: ResolverTypeWrapper<Loan>;
  LoanInput: LoanInput;
  LoanPage: ResolverTypeWrapper<LoanPage>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Payment: ResolverTypeWrapper<Payment>;
  PaymentType: PaymentType;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Loan: Loan;
  LoanInput: LoanInput;
  LoanPage: LoanPage;
  Mutation: Record<PropertyKey, never>;
  Payment: Payment;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
};

export type LoanResolvers<ContextType = any, ParentType extends ResolversParentTypes['Loan'] = ResolversParentTypes['Loan']> = {
  endDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interestRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payments?: Resolver<Array<ResolversTypes['Payment']>, ParentType, ContextType>;
  principal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalInterest?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type LoanPageResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoanPage'] = ResolversParentTypes['LoanPage']> = {
  loans?: Resolver<Array<ResolversTypes['Loan']>, ParentType, ContextType>;
  loansCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createLoan?: Resolver<ResolversTypes['Loan'], ParentType, ContextType, RequireFields<MutationCreateLoanArgs, 'input'>>;
};

export type PaymentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interest?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  paymentDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentType?: Resolver<ResolversTypes['PaymentType'], ParentType, ContextType>;
  principal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  remainingBalance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  loan?: Resolver<Maybe<ResolversTypes['Loan']>, ParentType, ContextType, RequireFields<QueryLoanArgs, 'id'>>;
  loans?: Resolver<ResolversTypes['LoanPage'], ParentType, ContextType, Partial<QueryLoansArgs>>;
};

export type Resolvers<ContextType = any> = {
  Loan?: LoanResolvers<ContextType>;
  LoanPage?: LoanPageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

