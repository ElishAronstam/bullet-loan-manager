import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PaymentEntity } from "./Payment";

@Entity()
export class LoanEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column("decimal")
  principal!: number;

  @Column()
  startDate!: string;

  @Column()
  endDate!: string;

  @Column("decimal")
  interestRate!: number;

  @Column("decimal", { default: 0 })
  totalInterest!: number;

  @OneToMany(() => PaymentEntity, (payment) => payment.loan, { cascade: true })
  payments!: PaymentEntity[];
}
