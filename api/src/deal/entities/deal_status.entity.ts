import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { DealEntity } from './deal.entity.js';

@Entity()
export class Deal_statusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => DealEntity, (deal_entity) => deal_entity.deal_status)
  deal_entities: Relation<DealEntity>[];
}
