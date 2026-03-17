import { AppDataSource } from "../../db/datasource";
import { LoanEntity } from "../../db/entities/Loan";

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
