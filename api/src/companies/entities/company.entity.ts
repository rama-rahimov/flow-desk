import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { CustomerEntity } from '../../customers/entities/customer.entity.js';
import { UserEntity } from '../../users/entities/user.entity.js';
import {ProductEntity} from "../../product/entities/product.entity.js";

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

@Entity('company')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  link: string;

  @Column({ type: 'int', default: 1 })
  employments_count: number;

  @Column({ type: 'date' })
  start_work: string;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.DISABLED,
  })
  status: string;

  @OneToMany(() => CustomerEntity, (customers) => customers.company)
  customers: Relation<CustomerEntity>[];

  @OneToMany(() => UserEntity, (user) => user.company)
  user: Relation<UserEntity>[];

  @OneToMany(() => ProductEntity, (products) => products.company)
  products: Relation<ProductEntity>[];

  @CreateDateColumn({ type: 'timestamptz' })
  create_at: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_at: string;
}
