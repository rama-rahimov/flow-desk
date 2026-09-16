import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn} from "typeorm";
import {Payment_statusEntity} from "./payment_status.entity.js";

@Entity('payment')
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    company_id: number;
    @Column({nullable:true})
    status: string;
    @Column()
    employee_limit: number;
    @Column({ type: 'decimal', scale:2 })
    price: number;
    @Column()
    currency: string;
    @Column()
    stripe_customer_id: string;
    @Column()
    stripe_subscription_id: string;
    @Column({ type: 'timestamptz', nullable: true })
    current_period_end: Date;
    @Column({ default: false })
    cancel_at_period_end: boolean;
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
    @ManyToOne(() => Payment_statusEntity, (payment_status) => payment_status.payments)
    payment_status: Relation<Payment_statusEntity>;
}