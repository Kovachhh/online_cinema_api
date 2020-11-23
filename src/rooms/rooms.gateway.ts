import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { RoomsService } from './rooms.service';

@WebSocketGateway()
export class RoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private RoomService: RoomsService, 
    ) { }

  @WebSocketServer() 
  server: Server;
 
  private logger: Logger = new Logger('RoomGateway');

  @SubscribeMessage('onEnterRoom')
  onEnterRoom(client: Socket, roomId): void {
    client.join(roomId);
    console.log('enter');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, data): void {
    console.log('socket')
    client.broadcast.to(data.roomId)
    .emit('msgToClient', {_id: data._id, username: data.username, text: data.text});
  }

  @SubscribeMessage('onLeaveRoom')
  onLeaveRoom(client: Socket, roomId): void {
    client.leave(roomId);
    console.log('leave')
  }

  @SubscribeMessage('onEditUrl')
  onEditUrl(client: Socket, data): void {
    this.RoomService.editUrl(data.roomId, data.newUrl);
    client.broadcast.to(data.roomId)
      .emit('updateRoomUrl', data.newUrl);
  }

  @SubscribeMessage('onPause')
  onPause(client: Socket, data): void {
    this.RoomService.updatePlayerStatus(data.roomId, data.status);
    client.broadcast.to(data.roomId)
      .emit('updatePlayerStatus', data.status);
  }

  @SubscribeMessage('onPlayedTime')
  onPlayedTime(client: Socket, data): void {
    this.RoomService.updatePlayedTime(data.roomId, data.playedTime);
    client.to(data.roomId)
      .emit('updatePlayedTime', data.playedTime);
  } 
 
  afterInit(server: Server) {
    this.logger.log('Init');
   }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
   }
  
   handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
   }
}