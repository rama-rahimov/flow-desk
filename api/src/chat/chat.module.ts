import {Module} from "@nestjs/common";
import {ChatService} from "./chat.service.js";
import {EventsGateway} from "./chat.gateway.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConversationEntity} from "./entities/conversation.entity.js";
import {MessageEntity} from "./entities/message.entity.js";
import {CustomerEntity} from "../customers/entities/customer.entity.js";
import {CompanyEntity} from "../companies/entities/company.entity.js";
import {ChatController} from "./chat.controller.js";

@Module({
    imports: [TypeOrmModule.forFeature([ConversationEntity, MessageEntity, CustomerEntity, CompanyEntity])],
    providers: [/*ChatService, EventsGateway*/],
    controllers: [/*ChatController*/],
})
export class ChatModule {}