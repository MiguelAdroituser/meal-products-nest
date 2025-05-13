import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]: Socket
}

@Injectable()
export class MealsWsService {

    private connectedClients: ConnectedClients = {}
    private wss: Server;

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    setServer(server: Server) {
        this.wss = server;
    }

    registerClient( client: Socket ) {
        this.connectedClients[client.id] = client;
    }

    removeClient( clientId: string ) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients(): string[] {
        // return Object.keys( this.connectedClients ).length;
        return Object.keys( this.connectedClients );
    }

    // Broadcast product updates to all connected clients
    broadcastProductUpdate(event: string, payload: any) {
        if (!this.wss) return;
        
        this.wss.emit(event, payload);
    }

    // Get current product list (for initial connection)
    async getInitialProducts(limit: number = 50): Promise<Product[]> {
        return await this.productRepository.find({
            order: { id: 'DESC' },
            take: limit
        });
    }

}
