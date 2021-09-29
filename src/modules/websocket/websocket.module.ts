import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm'
import { SocketRepository } from './websocket.repository';
import { Sockets } from './websocket.entity'
import { AuthGuard } from '../auth/auth.guard'

@Module({
    imports: [TypeOrmModule.forFeature([SocketRepository, Sockets])],
    controllers:[],
    providers:[WebsocketGateway,AuthGuard],
    exports:[WebsocketGateway]
})
export class WebsocketModule {
}
