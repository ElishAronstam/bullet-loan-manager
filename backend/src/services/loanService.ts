import { Like } from "typeorm";
import { AppDataSource } from "../db/datasource";
import { LoanEntity } from "../db/entities/Loan";
import { PaymentEntity } from "../db/entities/Payment";
import { SortOrder, type LoanInput } from "../graphql/generated/types";
import { fetchPrimeRateHistory, getCurrentPrimeRate } from "./primeRateScraper";
import { generateLoanPayments } from "./loanPaymentsGenerator";

const SORTABLE_FIELDS = ["name", "principal", "startDate", "totalInterest"] as const;
type SortableField = (typeof SORTABLE_FIELDS)[number];

export const createLoan = async (newLoan: LoanInput): Promise<LoanEntity> => {
  console.log(
    `Creating loan "${newLoan.name}" (${newLoan.startDate} → ${newLoan.endDate})`,
  );

  const isStartInPast = new Date(newLoan.startDate) < new Date();

  const currentRate = await getCurrentPrimeRate();
  console.log(`Current prime rate: ${currentRate}`);

  const rateHistory = isStartInPast
    ? await fetchPrimeRateHistory(newLoan.startDate, newLoan.endDate)
    : new Map([[newLoan.startDate, currentRate]]);

  const scheduleData = generateLoanPayments(
    newLoan.principal,
    newLoan.startDate,
    newLoan.endDate,
    rateHistory,
  );
  console.log(`Generated ${scheduleData.length} payments`);

  const loanRepo = AppDataSource.getRepository(LoanEntity);
  const paymentRepo = AppDataSource.getRepository(PaymentEntity);

  try {
    const result = await AppDataSource.transaction(async (manager) => {
      const totalInterest = Number(
        scheduleData.reduce((sum, payment) => sum + payment.interest, 0).toFixed(2),
      );

      const loan = loanRepo.create({
        name: newLoan.name,
        principal: newLoan.principal,
        startDate: newLoan.startDate,
        endDate: newLoan.endDate,
        interestRate: currentRate,
        totalInterest,
      });
      await manager.save(loan);

      const payments = scheduleData.map((payment) =>
        paymentRepo.create({ ...payment, loan }),
      );
      await manager.save(payments);

      loan.payments = payments;
      return loan;
    });

    console.log(`Loan "${result.name}" created with id ${result.id}`);
    return result;
  } catch (error) {
    console.error(`Failed to create loan "${newLoan.name}":`, error);
    const message = error instanceof Error ? error.message : "Unknown error";

    if (
      message.includes("UNIQUE constraint") ||
      message.includes("duplicate key")
    ) {
      throw new Error(`A loan with the name "${newLoan.name}" already exists`);
    }

    throw error;
  }
};

export const getLoans = async (
  page: number,
  pageSize: number,
  searchText?: string,
  sortBy?: string,
  sortOrder?: SortOrder,
) => {
  console.log(
    `Fetching loans page=${page} pageSize=${pageSize} searchText=${searchText??""} sortBy=${sortBy} sortOrder=${sortOrder}`,
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
  return { loans, loansCount };
};

export const getLoanById = async (id: number): Promise<LoanEntity | null> => {
  console.log(`Fetching loan id=${id}`);

  const repo = AppDataSource.getRepository(LoanEntity);
  const loan = await repo.findOne({
    where: { id },
    relations: ["payments"],
  });

  if (!loan) {
    console.log(`Loan id=${id} not found`);
  }

  return loan;
};
