import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";

@WebSocketGateway({
    cors:{
        origin:'http://localhost:5173/',
        credentials:true
    }
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    handleEvent(@MessageBody() data:string, @ConnectedSocket() client:Socket):string{
       client.emit('response',data);
       return 'ok';
    }
}