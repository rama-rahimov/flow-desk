import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  OneToMany,
  Column,
  Unique,
} from "typeorm";
import {CustomerEntity} from "../../customers/entities/customer.entity.js";
import {CompanyEntity} from "../../companies/entities/company.entity.js";
import {UserEntity} from "../../users/entities/user.entity.js";
import {MessageEntity} from "./message.entity.js";

@Entity('conversation')
@Unique(['clientId', 'company'])
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CustomerEntity, (customer: CustomerEntity) => customer.conversations)
  customer: Relation<CustomerEntity>;

  @ManyToOne(() => CompanyEntity, (company: CompanyEntity) => company.conversations)
  company: Relation<CompanyEntity>;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.conversations)
  user: Relation<UserEntity>;

  @OneToMany(() => MessageEntity, (message: MessageEntity) => message.conversation)
  messages: Relation<MessageEntity>;

  @Column({type: 'uuid', nullable: true,})
  clientId: string | null;
}