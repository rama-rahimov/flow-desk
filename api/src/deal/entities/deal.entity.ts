import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { Deal_statusEntity } from './deal_status.entity.js';
import { ProductEntity } from '../../product/entities/product.entity.js';
import { CustomerEntity } from '../../customers/entities/customer.entity.js';
import { UserEntity } from '../../users/entities/user.entity.js';

@Entity()
export class DealEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'date'})
  dead_line: number;

  @Column({type: 'decimal'})
  price: number;

  @ManyToOne(() => Deal_statusEntity, (deal_status) => deal_status.deal_entities)
  deal_status: Relation<Deal_statusEntity>

  @ManyToOne(() => CustomerEntity, (customer) => customer.deal_entities)
  customer: Relation<CustomerEntity>

  @ManyToOne(() => UserEntity, (manager) => manager.deal_entities)
  manager: Relation<UserEntity>

  @ManyToOne(() => ProductEntity, (product) => product.deal_entities)
  product: Relation<ProductEntity>;

  @CreateDateColumn({type: 'timestamptz'})
  created_at: Date;

  @UpdateDateColumn({type: 'timestamptz'})
  updated_at: Date;
}