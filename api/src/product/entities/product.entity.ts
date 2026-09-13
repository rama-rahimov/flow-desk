import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation, ManyToOne,
} from 'typeorm';
import { DealEntity } from '../../deal/entities/deal.entity.js';
import {CompanyEntity} from "../../companies/entities/company.entity.js";
import {ProductMediaEntity} from "./product_media.entity.js";
enum ProductCurrency {
  USD = 'USD',
  EUR = 'EUR',
  AZN = 'AZN'
}
@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', scale:2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ProductCurrency,
    default: ProductCurrency.USD,
  })
  status: ProductCurrency;

  @OneToMany(() => DealEntity, (deal_entity) => deal_entity.product)
  deal_entities: Relation<DealEntity>[];

  @OneToMany(() => ProductMediaEntity, (product_medias) => product_medias.product)
  product_medias: Relation<ProductMediaEntity>[];

  @ManyToOne(() => CompanyEntity, (company) => company.products)
  company: CompanyEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
