import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { RoomModel } from './models/room.model';

@Injectable()
export class RoomsService {
    constructor(@InjectModel('Room') private readonly roomModel: Model<RoomModel>) { }

    // async findAll(): Promise<RoomModel[]> {
    //     return this.roomModel.find().lean();
    // }

    async findRoom(query): Promise<RoomModel> {
        return this.roomModel.findOne(query).lean();
    }

    async editUrl(roomId, newUrl): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(roomId, { url: newUrl }, {new: true});
    }

    async updatePlayerStatus(roomId, status): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(roomId, { status }, {new: true});
    }

    async updatePlayedTime(roomId, playedTime): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(roomId, { playedTime }, {new: true});
    }

    async addRoom(data): Promise<RoomModel> {
        return new this.roomModel({name: data.name, membersId: [data.userId], owner: data.userId}).save();
    }

    async updateRoom(roomId, data): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(roomId, data, {new: true});
    }

    async joinRoom(roomId, data): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(roomId, {$push: {membersId: data}}, {new: true});
    }

    async findJoinedRooms(userId): Promise<RoomModel[]> {
        return this.roomModel.find({membersId : {$in : [userId]}}).lean();
    }

    async deleteRoom(roomId): Promise<RoomModel> {
        return this.roomModel.findByIdAndRemove(roomId);
    }

    // async deleteFromRoom(roomId, username): Promise<RoomModel> {
    //     return this.roomModel.findByIdAndUpdate(roomId, {$pull: {membersId: username}}, {new: true});
    // }

    async leaveFromRoom(roomId, userId): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(roomId, {$pull: {membersId: userId}}, {new: true});
    }
}
