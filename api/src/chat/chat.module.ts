import {Module} from "@nestjs/common";
import {ChatService} from "./chat.service.js";
import {EventsGateway} from "./chat.gateway.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConversationEntity} from "./entities/conversation.entity.js";
import {MessageEntity} from "./entities/message.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([ConversationEntity, MessageEntity])],
    providers: [ChatService, EventsGateway],
})
export class ChatServiceModule {}