import {ProductMediaEntity} from "../../product/entities/product_media.entity.js";
import {
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn, Relation,
} from 'typeorm';

@Entity('media')
export class MediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  original_name: string;

  @Column({ type: 'varchar', length: 300 })
  url: string;

  @Column({ type: 'varchar', length: 300 })
  public_id: string;

  @Column({ type: 'varchar', length: 200 })
  file_name: string;

  @Column({ type: 'varchar', length: 200 })
  mime_type: string;

  @Column({ type: 'integer' })
  size: number;

  @OneToMany(() => ProductMediaEntity, (product_medias) => product_medias.product)
  product_medias: Relation<ProductMediaEntity>[];

  @CreateDateColumn()
  created_at: Date;
}
