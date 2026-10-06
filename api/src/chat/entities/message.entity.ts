import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn} from "typeorm";
import {ConversationEntity} from "./conversation.entity.js";
export enum SenderType {
    CLIENT= 'CLIENT',
    EMPLOYEE= 'EMPLOYEE'
}
@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ConversationEntity, (conversation: ConversationEntity) => conversation.messages)
    conversation: Relation<ConversationEntity>

    @Column()
    senderId: string;

    @Column({type:"enum", enum: SenderType})
    senderType: SenderType;

    @Column({type: 'text'})
    message: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}