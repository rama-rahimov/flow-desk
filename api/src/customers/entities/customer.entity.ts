import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { CompanyEntity } from '../../companies/entities/company.entity.js';
import { DealEntity } from '../../deal/entities/deal.entity.js';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => DealEntity, (deal_entity) => deal_entity.customer)
  deal_entities: Relation<DealEntity>[];

  @ManyToOne(() => CompanyEntity, (company) => company.customers)
  company: Relation<CompanyEntity>;

  @CreateDateColumn({ type: 'timestamptz' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_at: Date;
}
