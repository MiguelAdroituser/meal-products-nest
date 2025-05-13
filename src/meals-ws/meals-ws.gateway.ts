import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MealsWsService } from './meals-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { ProductsService } from 'src/products/products.service';

@WebSocketGateway({ 
  cors: true,
  namespace: '/products' // Specific namespace for products
})
export class MealsWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly mealsWsService: MealsWsService,
    private readonly productsService: ProductsService
  ) {}

  afterInit(server: Server) {
    this.mealsWsService.setServer(server);
  }

  /* handleConnection( client: Socket ) {
    // console.log('cliente conectado', client.id)
    this.mealsWsService.registerClient( client );

      // Unirse a sala de ventas, y emitir a la misma.
      // client.join('ventas');
      // this.wss.to('ventas').emit(''); 

    this.wss.emit('clients-updated', this.mealsWsService.getConnectedClients());
  } */

  async handleConnection(client: Socket) {
      this.mealsWsService.registerClient(client);
      
      // Send initial product data to newly connected client
      const products = await this.mealsWsService.getInitialProducts();
      client.emit('initial-products', products);
      
      // Update all clients about new connection
      this.wss.emit('clients-updated', this.mealsWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.mealsWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.mealsWsService.getConnectedClients());
  }


  /* handleDisconnect( client: Socket ) {
    // console.log('cliente desconectado', client.id)
    this.mealsWsService.removeClient( client.id );

    this.wss.emit('clients-updated', this.mealsWsService.getConnectedClients());
  } */

  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: NewMessageDto ) {
    // console.log(client.id, payload)

    // Emite unicamente al cliente
    /* client.emit('message-from-server', {
      fullName: 'Soyyo',
      message: payload.message || 'no-message'
    }); */

    // Emitir a todos MENOS, al cliente inicial
    client.broadcast.emit('message-from-server', {
      fullName: 'Soyyo',
      message: payload.message || 'no-message'
    });

    //this.wss.to('ClientID')

    //Emite a todos
    /* this.wss.emit('message-from-server', {
      fullName: 'Soyyo',
      message: payload.message || 'no-message'
    }); */

  }

}
