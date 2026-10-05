import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm";
import {ConversationEntity} from "./conversation.entity.js";
enum SenderType {
    CLIENT= 'CLIENT',
    EMPLOYEE= 'EMPLOYEE'
}
@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ConversationEntity, (conversation: ConversationEntity) => conversation.messages)
    conversation: Relation<ConversationEntity>

    @Column({type:"int"})
    senderId: number;

    @Column({type:"enum", enum: SenderType})
    senderType: SenderType;

    @Column({type: 'text'})
    message: string;

    @CreateDateColumn()
    created_at: Date;
}