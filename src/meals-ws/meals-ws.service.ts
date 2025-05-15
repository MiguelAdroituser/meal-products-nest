import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { EventsService } from 'src/events/events.service';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]: Socket
}

@Injectable()
export class MealsWsService {

    private connectedClients: ConnectedClients = {}
    private server: Server;
    // private wss: Server;

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly eventsService: EventsService // Add this
    ) {}

    setServer(server: Server) {
        this.server = server;
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
    /* broadcastProductUpdate(event: string, payload: any) {
        if (!this.server) return;
        
        this.server.emit(event, payload);
    } */

    // Enhanced broadcast method for products
    /* broadcastProductUpdate(type: 'created' | 'updated' | 'deleted', product: Product | { id: number }) {
        if (!this.server) return;
        
        switch (type) {
            case 'created':
                this.server.emit('product-created', product);
                break;
            case 'updated':
                this.server.emit('product-updated', product);
                break;
            case 'deleted':
                this.server.emit('product-deleted', product);
                break;
        }
    } */

    // In your meals-ws.service.ts
    /* broadcastUpdate(event: string, payload: any) {
        if (this.server) {
        this.server.emit(event, payload);
        }
    } */
   // Replace your existing broadcast method with:
   broadcastUpdate(event: string, payload: any) {
    this.eventsService.broadcast(event, payload);
   }

    // Optional: Get initial products directly from service if needed
    async getInitialProducts(limit = 50): Promise<Product[]> {
        return this.productRepository.find({
            order: { id: 'DESC' },
            take: limit
        });
    }

}
