import { Body, Controller, ForbiddenException, forwardRef, Get, Inject, NotFoundException, Param, Patch, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
const shortid = require('shortid');
import { RoomsService } from 'src/rooms/rooms.service';
import { ADMIN_TYPE, MEMBER_TYPE } from 'src/utils/enum.constants';

import { InvitesService } from './invites.service';

@Controller('api/v1/invites')
export class InvitesController {
    constructor(
        private InvitesService: InvitesService,
        @Inject(forwardRef(() => RoomsService)) private RoomsService: RoomsService,
        ) { }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Get('/:roomId')
    async getInvite(@Res() res, @Param('roomId') roomId){
        try{
            const roomInvite = await this.InvitesService.findInvite({roomId});

            if (!roomInvite) throw new NotFoundException();

            res.json(roomInvite);
        }catch(e){
            console.log(e)
            res.responseException({message: e.response, status: e.status});
        }
    }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Patch('/:roomId')
    async generateRoomInvite(@Req() req, @Res() res, @Param('roomId') roomId){
        try{
            const { userId } = req.user;
            const room = await this.RoomsService.findRoom({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "This room doesn't exist."
            });

            if(room.owner !== userId) throw new ForbiddenException;

            const code = shortid.generate();
            const roomInvite = await this.InvitesService.updateInvite(roomId, {code, status: true});

            res.json(roomInvite.code);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Patch('/:roomId/reset')
    async closeInvite(@Req() req, @Res() res, @Param('roomId') roomId){
        try{
            const { userId } = req.user;
            const room = await this.RoomsService.findRoom({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "This room doesn't exist."
            });

            if(room.owner !== userId) throw new ForbiddenException;

            const roomInvite = await this.InvitesService.updateInvite(roomId, {code: null, status: false});

            res.json(roomInvite);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }
}
