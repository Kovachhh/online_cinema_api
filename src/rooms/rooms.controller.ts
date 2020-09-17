import { Controller, Get, Res, Req, Post, Body, Patch, Delete, Param, NotFoundException } from '@nestjs/common';

import { RoomsService } from './rooms.service';

@Controller('api/v1/rooms')
export class RoomsController {
    constructor(
        private RoomService: RoomsService, 
        ) { }

    @Get('')
    async getRooms(@Res() res, @Req() req){
        try{
            const rooms = await this.RoomService.findAll();
            res.json(rooms);
        }catch(e){
            console.log(e);
        }
    }

    @Get('/:roomId')
    async getRoom(@Res() res, @Req() req, @Param('roomId') roomId){
        try{
            const room = await this.RoomService.findRoom(roomId);
            res.json(room);
        }catch(e){
            console.log(e);
        }
    }

    @Post('')
    async addRoom(@Res() res, @Req() req, @Body() data){
        try{
            const { name, username } = data;
            const room = await this.RoomService.addRoom({name, username});
            res.json(room);
        }catch(e){
            console.log(e);
        }
    }
    
    @Patch('/:roomId/edit')
    async updateRoom(@Res() res, @Req() req, @Param('roomId') roomId, @Body() data){
        try{
            const { name, username } = data;

            const room = await this.RoomService.findOne({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });

            
            if (!room.owner == username) throw new NotFoundException({
                statusCode: 404,
                error: "You are not owner of this room."
            });

            const updatedRoom = await this.RoomService.updateRoom(roomId, name);
            res.json(updatedRoom);
        }catch(e){
            console.log(e);
        }
    }

    @Patch('/:roomId/join')
    async joinRoom(@Res() res, @Req() req, @Param('roomId') roomId, @Body() data){
        try{
            const { username } = data;
            
            const room = await this.RoomService.findOne({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });

            const updatedRoom = await this.RoomService.joinRoom(roomId, username);
            res.json(updatedRoom);
        }catch(e){
            console.log(e);
        }
    }

    @Patch('/:roomId/removeMember/:username')
    async removeMemberFromRoom(@Res() res, @Req() req, @Param() params){
        try{
            const { roomId, username } = params;
            
            const room = await this.RoomService.findOne({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });

            if (!room.owner == username) throw new NotFoundException({
                statusCode: 404,
                error: "You are not owner of this room."
            });

            if (!room.membersId.includes(username)) throw new NotFoundException({
                statusCode: 404,
                error: "The user with this id does not exist in this room."
            });

            const updatedRoom = await this.RoomService.deleteFromRoom(roomId, username);
            res.json(updatedRoom);
        }catch(e){
            console.log(e);
        }
    }

    @Patch('/:roomId/leave')
    async leaveFromRoom(@Res() res, @Req() req, @Param('roomId') roomId, @Body() data){
        try{
            const { username } = data;
            
            const room = await this.RoomService.findOne({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });

            if (!room.membersId.includes(username)) throw new NotFoundException({
                statusCode: 404,
                error: "You are not in this room."
            });

            const updatedRoom = await this.RoomService.leaveFromRoom(roomId, username);
            res.json(updatedRoom);
        }catch(e){
            console.log(e);
        }
    }

    @Delete('/:roomId/delete')
    async deleteRoom(@Res() res, @Req() req, @Param('roomId') roomId){
        try{
            const room = await this.RoomService.findOne({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });

            const deletedRoom = await this.RoomService.deleteRoom(roomId);
            res.json(deletedRoom);
        }catch(e){
            console.log(e);
        }
    }


}
