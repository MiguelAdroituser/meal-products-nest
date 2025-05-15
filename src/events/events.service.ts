import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class EventsService {
    private server: Server;

    setServer(server: Server) {
        this.server = server;
    }

    broadcast(event: string, payload: any) {
        if (this.server) {
            this.server.emit(event, payload);
        }
    }
}