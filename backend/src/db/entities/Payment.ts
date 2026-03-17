import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { LoanEntity } from "./Loan";
import { PaymentType } from "../../graphql/generated/types";

export { PaymentType };

@Entity()
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => LoanEntity, (loan) => loan.payments)
  loan!: LoanEntity;

  @Column()
  paymentDate!: string;

  @Column({ type: "text" })
  paymentType!: PaymentType;

  @Column("decimal")
  principal!: number;

  @Column("decimal")
  interest!: number;

  @Column("decimal")
  total!: number;

  @Column("decimal")
  remainingBalance!: number;
}
