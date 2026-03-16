import "reflect-metadata";
import { DataSource } from "typeorm";
import { LoanEntity } from "./entities/Loan";
import { PaymentEntity } from "./entities/Payment";

export const AppDataSource = new DataSource({
  type: "sqljs",
  location: "loans.db",
  autoSave: true,
  synchronize: true,
  logging: false,
  entities: [LoanEntity, PaymentEntity],
});
