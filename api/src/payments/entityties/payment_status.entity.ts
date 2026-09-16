import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm";
import {PaymentEntity} from "./payment.entity.js";

@Entity('payment_status')
export class Payment_statusEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => PaymentEntity, (payment) => payment.payment_status)
  payments: Relation<PaymentEntity>[];
}