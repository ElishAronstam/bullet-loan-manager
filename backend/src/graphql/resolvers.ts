import { createLoan, getLoans, getLoanById } from "../services/loanService";
import { PaymentType } from "../db/entities/Payment";
import type {
  QueryLoansArgs,
  QueryLoanArgs,
  MutationCreateLoanArgs,
} from "./generated/types";

export const resolvers = {
  PaymentType: {
    Interest: PaymentType.Interest,
    PrincipalAndInterest: PaymentType.PrincipalInterest,
  },

  Query: {
    loans: async (
      _parent: unknown,
      { page, pageSize, searchText, sortBy, sortOrder }: QueryLoansArgs,
    ) => {
      return await getLoans(
        page ?? 1,
        pageSize ?? 10,
        searchText ?? undefined,
        sortBy ?? undefined,
        sortOrder ?? undefined,
      );
    },
    loan: async (_parent: unknown, { id }: QueryLoanArgs) => {
      return await getLoanById(Number(id));
    },
  },

  Mutation: {
    createLoan: async (_parent: unknown, { input }: MutationCreateLoanArgs) => {
      return await createLoan(input);
    },
  },
};
