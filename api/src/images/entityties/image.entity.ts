import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ImagesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 300 })
  url: string;

  @Column()
  public_id: number;

  @Column({ type: 'varchar', length: 200 })
  file_name: string;

  @Column({ type: 'varchar', length: 200 })
  mime_type: string;

  @Column({ type: 'varchar', length: 100 })
  size: string;

  @CreateDateColumn()
  created_at: Date;
}
