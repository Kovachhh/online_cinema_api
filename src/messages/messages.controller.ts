import { Body, Controller, ForbiddenException, forwardRef, Get, Inject, NotFoundException, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoomsService } from 'src/rooms/rooms.service';
import { ADMIN_TYPE, MEMBER_TYPE } from 'src/utils/enum.constants';
import { MessagesService } from './messages.service';

@Controller('/api/v1/messages')
export class MessagesController {
    constructor(
        private MessageService: MessagesService,
        @Inject(forwardRef(() => RoomsService)) private RoomService: RoomsService,
    ) {}    

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Get('/room/:roomId')
    async getRoomMessages(@Res() res, @Req() req, @Param('roomId') roomId){
        try{
            const { userId } = req.user;
            const room = await this.RoomService.findRoom({_id: roomId});

            if (!room) throw new NotFoundException({
                statusCode: 404,
                error: "This room doesn't exist."
            });

            if(!room.membersId.includes(userId)) throw new ForbiddenException();

            const messages = await this.MessageService.findRoomMessages({roomId});
            res.json(messages);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Post('/room/:roomId')
    async sendMessage(@Res() res, @Req() req, @Param('roomId') roomId, @Body() body){
        try{
            const { userId, username } = req.user;
            const sendedMessage = await this.MessageService.sendMessage({roomId, userId, username, text: body.text});
            res.json(sendedMessage);
        }catch(e){
            console.log(e);
            res.responseException({message: e.response, status: e.status});
        }
    }
}
