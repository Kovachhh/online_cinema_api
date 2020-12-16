import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageModel } from './models/message.model';

@Injectable()
export class MessagesService {
    constructor(@InjectModel('Message') private readonly messageModel: Model<MessageModel>) { }

    async findRoomMessages(query): Promise<MessageModel[]> {
        return this.messageModel.find(query).lean();
    }

    async sendMessage(data): Promise<MessageModel> {
        const { roomId, userId, username, text} = data;
        return new this.messageModel({roomId, userId, username, text}).save();
    }
}
