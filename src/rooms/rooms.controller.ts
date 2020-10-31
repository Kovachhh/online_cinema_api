import { Controller, Get, Res, Req, Post, Body, Patch, Delete, Param, NotFoundException, Inject, forwardRef, Header, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InvitesService } from 'src/invites/invites.service';
import { ADMIN_TYPE, MEMBER_TYPE } from 'src/utils/enum.constants';

import { RoomsService } from './rooms.service';

@Controller('api/v1/rooms')
export class RoomsController {
    constructor(
        private RoomService: RoomsService, 
        @Inject(forwardRef(() => InvitesService)) private InviteService: InvitesService,
        ) { }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Get('')
    async getRooms(@Res() res, @Req() req){
        try{
            const { userId } = req.user;
            const rooms = await this.RoomService.findJoinedRooms(userId);
            res.json(rooms);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Get('/:roomId')
    async getRoom(@Res() res, @Req() req, @Param('roomId') roomId){
        try{
            const { userId } = req.user;

            const room = await this.RoomService.findRoom({_id: roomId});

            if(!room.membersId.includes(userId)) throw new ForbiddenException();

            if(!room) throw new NotFoundException();

            res.json(room);
        }catch(e){
            console.log(e)
            res.responseException({message: e.response, status: e.status});
        }
    }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Post('')
    async addRoom(@Res() res, @Req() req, @Body() data){
        try{
            const { name } = data;
            const { userId } = req.user;
            const room = await this.RoomService.findRoom({name});

            if (room) throw new NotFoundException({
                statusCode: 404,
                error: "This name of room is exist."
            });

            const newRoom = await this.RoomService.addRoom({name, userId});
            await this.InviteService.addRoomInvite({roomId: newRoom._id});
            res.json(newRoom);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }
    
    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Patch('/:roomId/edit')
    async updateRoom(@Res() res, @Req() req, @Param('roomId') roomId, @Body() data){
        try{
            const { name } = data;
            const { userId } = req.user;

            const room = await this.RoomService.findRoom({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });

            if (!room.owner == userId) throw new NotFoundException({
                statusCode: 404,
                error: "You are not owner of this room."
            });

            const updatedRoom = await this.RoomService.updateRoom(roomId, {name});
            res.json(updatedRoom.name);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))    
    @Patch('/join')
    async joinRoom(@Res() res, @Req() req, @Body() data){
        try{
            const { invite } = data;
            const { userId } = req.user;

            const inviteRoom = await this.InviteService.findInvite({code: invite});

            if(!inviteRoom || !inviteRoom.status){
                throw new NotFoundException({
                    statusCode: 404,
                    error: "This invite code is incorrect."
                });
            }
            
            const room = await this.RoomService.findRoom({_id: inviteRoom.roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });

            if (room.membersId.includes(userId)) throw new NotFoundException({
                statusCode: 404,
                error: "You are already in this room."
            });

            const updatedRoom = await this.RoomService.joinRoom(inviteRoom.roomId, userId);
            res.json(updatedRoom);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }

    // @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    // @Patch('/:roomId/removeMember/:userId')
    // async removeMemberFromRoom(@Res() res, @Req() req, @Param() params){
    //     try{
    //         const { roomId } = params;
    //         const { userId } = req.user;
            
    //         const room = await this.RoomService.findRoom({_id: roomId});

    //         if (!room) throw new NotFoundException({
    //             statusCode: 404,
    //             error: "A room with this id not found."
    //         });

    //         if (!room.owner == userId) throw new NotFoundException({
    //             statusCode: 404,
    //             error: "You are not owner of this room."
    //         });

    //         if (!room.membersId.includes(userId)) throw new NotFoundException({
    //             statusCode: 404,
    //             error: "The user with this id does not exist in this room."
    //         });

    //         const updatedRoom = await this.RoomService.deleteFromRoom(roomId, userId);
    //         res.json(updatedRoom);
    //     }catch(e){
    //         console.log(e);
    //         res.responseException({message: e.response, status: e.status});
    //     }
    // }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Patch('/:roomId/leave')
    async leaveFromRoom(@Res() res, @Req() req, @Param('roomId') roomId){
        try{
            const { userId } = req.user;
            
            const room = await this.RoomService.findRoom({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });
            
            if (!room.membersId.includes(userId)) throw new NotFoundException({
                statusCode: 404,
                error: "You are not in this room."
            });

            if (room.owner === userId) throw new NotFoundException({
                statusCode: 404,
                error: "You are owner of this room."
            });

            const updatedRoom = await this.RoomService.leaveFromRoom(roomId, userId);
            res.json(updatedRoom);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Delete('/:roomId/delete')
    async deleteRoom(@Res() res, @Req() req, @Param('roomId') roomId){
        try{
            const { userId } = req.user;
            const room = await this.RoomService.findRoom({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "A room with this id not found."
            });

            if (!room.owner == userId) throw new NotFoundException({
                statusCode: 404,
                error: "You are not owner of this room."
            });
            await this.InviteService.deleteInvite({roomId: room._id})
            const deletedRoom = await this.RoomService.deleteRoom(roomId);
            res.json(deletedRoom);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }


}
