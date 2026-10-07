import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {parse} from "cookie";
import {ChatService} from "./chat.service.js";
import {MessageDto} from "./dto/message.dto.js";

@WebSocketGateway({
    cors:{
        origin:'http://localhost:5173',
        credentials:true
    }
})
export class EventsGateway {
    constructor(private readonly chatService:ChatService) {}
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const cookies = parse(client.handshake.headers.cookie ?? '');
        const visitorId = cookies.visitorId;
        client.data.visitorId = visitorId;
    }

   @SubscribeMessage('message')
   async handleEvent(@MessageBody() data:MessageDto, @ConnectedSocket() client:Socket){
       console.log({data});
      const result = await this.chatService.messageHandler({...data, visitorId: client.data.visitorId});
       console.log({result});
      client.to(String(result.conversationId)).emit('message',result);
    }
}