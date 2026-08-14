import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { DealEntity } from '../../deal/entities/deal.entity.js';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 250})
  name: string;

  @Column({type: 'text'})
  description: string;

  @OneToMany(() => DealEntity, (deal_entity) => deal_entity.product)
  deal_entities: Relation<DealEntity>[];

  @CreateDateColumn({type: 'timestamptz'})
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamptz'})
  updatedAt: Date;
}