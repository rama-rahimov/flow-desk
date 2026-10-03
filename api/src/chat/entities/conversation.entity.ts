import {Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm";
import {CustomerEntity} from "../../customers/entities/customer.entity.js";
import {CompanyEntity} from "../../companies/entities/company.entity.js";
import {UserEntity} from "../../users/entities/user.entity.js";

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CustomerEntity, (customer: CustomerEntity) => customer.conversations)
  customer: Relation<CustomerEntity>

  @ManyToOne(() => CompanyEntity, (company: CompanyEntity) => company.conversations)
  company: Relation<CompanyEntity>

  @ManyToOne(() => UserEntity, (user: CustomerEntity) => user.conversations)
  user: Relation<CustomerEntity>
}