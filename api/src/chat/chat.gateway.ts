import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {parse} from "cookie";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import {ChatService} from "./chat.service.js";
import {MessageDto} from "./dto/message.dto.js";
import * as process from "node:process";

@WebSocketGateway({
    cors:{
        origin:'http://localhost:5173',
        credentials:true,
    }
})
export class EventsGateway {
    constructor(private readonly chatService:ChatService) {}
    @WebSocketServer()
    server: Server;

   async handleConnection(client: Socket) {
        const cookies = parse(client.handshake.headers.cookie ?? '');
        const token = client.handshake.auth.token;
       console.log({token, jwt: process.env.JWT_SECRET});
       if (typeof token === 'string' && process.env.JWT_SECRET) {
         const data = jwt.verify(token, process.env.JWT_SECRET);
         client.data.senderId = data.sub;
       }
       client.data.visitorId = cookies.visitorId;
    }

   @SubscribeMessage('message')
   async handleEvent(@MessageBody() data:MessageDto, @ConnectedSocket() client:Socket){
       console.log({data});
      const result = await this.chatService.messageHandler({...data, visitorId: client.data.visitorId});
       console.log({result});
       client.join(String(result.conversationId));
       console.log('ROOM EXISTS:', this.server.sockets.adapter.rooms.has(String(result.conversationId)));
       console.log('ROOM CLIENTS:', this.server.sockets.adapter.rooms.get(String(result.conversationId))?.size);
      this.server.to(String(result.conversationId)).emit('message',result);
       console.log("Emmmit");
    }
}