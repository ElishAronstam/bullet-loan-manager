import { Like } from "typeorm";
import { AppDataSource } from "../../db/datasource";
import { LoanEntity } from "../../db/entities/Loan";
import { SortOrder } from "../../graphql/generated/types";

const SORTABLE_FIELDS = [
  "name",
  "principal",
  "startDate",
  "totalInterest",
] as const;
type SortableField = (typeof SORTABLE_FIELDS)[number];

export const getLoans = async (
  page: number,
  pageSize: number,
  searchText?: string,
  sortBy?: string,
  sortOrder?: SortOrder,
) => {
  console.log(
    `Fetching loans page=${page} pageSize=${pageSize} searchText=${searchText ?? ""} sortBy=${sortBy} sortOrder=${sortOrder}`,
  );

  const loanRepository = AppDataSource.getRepository(LoanEntity);

  const where = searchText ? { name: Like(`%${searchText}%`) } : {};

  const orderField: SortableField =
    sortBy && SORTABLE_FIELDS.includes(sortBy as SortableField)
      ? (sortBy as SortableField)
      : "name";
  const orderDirection = sortOrder === SortOrder.Desc ? "DESC" : "ASC";

  const [loans, loansCount] = await loanRepository.findAndCount({
    where,
    order: { [orderField]: orderDirection },
    skip: (page - 1) * pageSize,
    take: pageSize,
    relations: ["payments"],
  });

  console.log(`Fetched ${loans.length} of ${loansCount} loans`);
  console.log(loans)
  return { loans, loansCount };
};
