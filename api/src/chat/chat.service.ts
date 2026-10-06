import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ConversationEntity} from "./entities/conversation.entity.js";
import {Repository} from "typeorm";
import {MessageEntity} from "./entities/message.entity.js";

@Injectable()
export class ChatService {
constructor(@InjectRepository(ConversationEntity) private  readonly conversationDB: Repository<ConversationEntity>,
   @InjectRepository(MessageEntity) private readonly messageDB: Repository<MessageEntity>) {}
    async messageHandler(){

    }
}