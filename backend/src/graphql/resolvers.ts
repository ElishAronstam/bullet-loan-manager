import { createLoan } from "../services/loans/createLoan";
import { getLoans } from "../services/loans/getLoans";
import { getLoanById } from "../services/loans/getLoanById";
import type {
  QueryLoansArgs,
  QueryLoanArgs,
  MutationCreateLoanArgs,
} from "./generated/types";

export const resolvers = {
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
