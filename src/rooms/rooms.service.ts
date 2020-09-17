import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { RoomModel } from './models/room.model';
// import { ICreateRoom } from './interfaces/room.interface';

@Injectable()
export class RoomsService {
    constructor(@InjectModel('Room') private readonly roomModel: Model<RoomModel>) { }

    async findAll(): Promise<RoomModel[]> {
        return this.roomModel.find().lean();
    }

    async findRoom(roomId): Promise<RoomModel> {
        return this.roomModel.find({_id: roomId}).lean();
    }

    async addRoom(data): Promise<RoomModel> {
        return new this.roomModel({name: data.name, membersId: [data.username], owner: data.username}).save();
    }

    async updateRoom(taskId, data): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(taskId, {name: data}, {new: true});
    }

    async joinRoom(taskId, data): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(taskId, {$push: {membersId: data}}, {new: true});
    }

    async deleteRoom(taskId): Promise<RoomModel> {
        return this.roomModel.findByIdAndRemove(taskId);
    }

    async deleteFromRoom(roomId, username): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(roomId, {$pull: {membersId: username}}, {new: true});
    }

    async leaveFromRoom(roomId, username): Promise<RoomModel> {
        return this.roomModel.findByIdAndUpdate(roomId, {$pull: {membersId: username}}, {new: true});
    }

    async findOne(query): Promise<RoomModel> {
        return this.roomModel.findOne(query);
    }
}
