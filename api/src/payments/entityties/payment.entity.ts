import {Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    company_id: number;
    @Column()
    plan:number;
    @Column()
    status: string;
    @Column()
    employee_limit: number;
    @Column()
    price: string;
    @Column()
    currency: string;
    @Column()
    stripe_customer_id: string;
    @Column()
    stripe_subscription_id: string;
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
    @Column()
    currency_period_end: string;
}