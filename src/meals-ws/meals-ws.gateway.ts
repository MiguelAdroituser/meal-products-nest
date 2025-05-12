import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MealsWsService } from './meals-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MealsWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly mealsWsService: MealsWsService) {}

  handleConnection( client: Socket ) {
    console.log('cliente conectado', client.id)
  }

  handleDisconnect( client: Socket ) {
    console.log('cliente desconectado', client.id)
  }
}
