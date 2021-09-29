import { Logger, BadRequestException } from '@nestjs/common'
import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect,SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'http';
import { AuthGuard } from '../auth/auth.guard';
import { SocketRepository, getClientBy } from './websocket.repository'


@WebSocketGateway({namespace:'/notification'})

export class WebsocketGateway implements OnGatewayConnection,OnGatewayDisconnect {
  constructor(public readonly authService:AuthGuard,
    public readonly socketRepository: SocketRepository){

  }

  private logger:Logger = new Logger('websocket');

  @WebSocketServer()
  wss
  
  // async afterInit(server:Server){
  //   this.logger.log(`Initialised`);
  // }

  async handleConnection(client){
    client.emit('connection', 'Successfully connected to server')
    client.on('user', async user=> {
      try {
      //  const user = (await this.authService.validateToken('Bearer ' + data.token)) as any
        const res1 = await getClientBy({ clientId: client.id })
        const res2 = await getClientBy({ user: user.id })
        if (res1 || res2) {
          const id = res1 ? res1.clientId : res2.clientId
          await this.socketRepository.update(id, { clientId: client.id, user: user.id })
          this.logger.log(`Update client ${client.id} for user ${user.id}`)
        } else {
          console.log("Inside handleConnection")
          await this.socketRepository.insert({ clientId: client.id, user: user.id })
          this.logger.log(`New client connected ${client.id}`)
        }
      } catch (err) {
        throw new BadRequestException(err.message)
      }
    })

  }

  async handleDisconnect(client) {
    await this.socketRepository.delete({ clientId: client.id })
    this.logger.log(`Client disconnected ${client.id}`)
  }

}
