import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Relation,
    JoinColumn, OneToOne
} from 'typeorm';
import { DealEntity } from '../../deal/entities/deal.entity.js';
import { CompanyEntity } from '../../companies/entities/company.entity.js';
import {MediaEntity} from "../../images/entityties/image.entity.js";

@Entity('users')
export class UserEntity {
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

  @Column({ type: 'int' })
  role_id: number;

  @ManyToOne(() => CompanyEntity, (company) => company.user)
  company: Relation<CompanyEntity>;

  @OneToMany(() => DealEntity, (deal_entity) => deal_entity.manager)
  deal_entities: Relation<DealEntity>[];

  @OneToOne(() => MediaEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'avatar_media_id' })
  avatar: MediaEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_at: Date;
}
