import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {parse} from "cookie";

@WebSocketGateway({
    cors:{
        origin:'http://localhost:5173',
        credentials:true
    }
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const cookies = parse(client.handshake.headers.cookie ?? '');
        const visitorId = cookies.visitorId;
        client.data.visitorId = visitorId;
        console.log('Connected:', visitorId);
    }

    @SubscribeMessage('message')
    handleEvent(@MessageBody() data:string, @ConnectedSocket() client:Socket):string{
       client.emit('response',data);
       return 'ok';
    }
}