import {Module} from "@nestjs/common";
import {ChatService} from "./chat.service.js";
import {EventsGateway} from "./chat.gateway.js";

@Module({
    providers: [ChatService, EventsGateway],
})
export class ChatServiceModule {}