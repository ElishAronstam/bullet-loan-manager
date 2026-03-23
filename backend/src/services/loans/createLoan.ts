import { AppDataSource } from "../../db/datasource";
import { LoanEntity } from "../../db/entities/Loan";
import { PaymentEntity } from "../../db/entities/Payment";
import type { LoanInput } from "../../graphql/generated/types";
import {
  getCurrentPrimeRate,
  fetchPrimeRateHistory,
} from "../rates/primeRateScraper";
import { generateLoanPayments } from "./loanPaymentsGenerator";

export const createLoan = async (newLoan: LoanInput): Promise<LoanEntity> => {
  console.log(
    `Creating loan "${newLoan.name}" (${newLoan.startDate} → ${newLoan.endDate})`,
  );

  const currentRate = await getCurrentPrimeRate();
  console.log(`Current prime rate: ${currentRate}`);

  const isStartInPast = new Date(newLoan.startDate) < new Date();
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
        scheduleData
          .reduce((sum, payment) => sum + payment.interest, 0)
          .toFixed(2),
      );

      const loan = loanRepo.create({
        name: newLoan.name,
        principal: newLoan.principal,
        startDate: newLoan.startDate,
        endDate: newLoan.endDate,
        interestRate: currentRate,
        totalInterest,
        paymentType: newLoan.paymentType,
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
