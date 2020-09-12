import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoomModel } from './models/room.model';

@Injectable()
export class RoomsService {
    constructor(@InjectModel('Room') private readonly RoomModel: Model<RoomModel>) { }

    async findAll(): Promise<RoomModel[]> {
        return this.RoomModel.find().lean();
    }

    async addRoom(data): Promise<RoomModel> {
        return new this.RoomModel({name: data.name, membersId: [data.username], owner: data.username}).save();
    }

    async updateRoom(taskId, data): Promise<RoomModel> {
        return this.RoomModel.findByIdAndUpdate(taskId, {name: data}, {new: true});
    }

    async joinRoom(taskId, data): Promise<RoomModel> {
        return this.RoomModel.findByIdAndUpdate(taskId, {$push: {membersId: data}}, {new: true});
    }

    async deleteRoom(taskId): Promise<RoomModel> {
        return this.RoomModel.findByIdAndRemove(taskId);
    }

    async deleteFromRoom(roomId, username): Promise<RoomModel> {
        return this.RoomModel.findByIdAndUpdate(roomId, {$pull: {membersId: username}}, {new: true});
    }

    async leaveFromRoom(roomId, username): Promise<RoomModel> {
        return this.RoomModel.findByIdAndUpdate(roomId, {$pull: {membersId: username}}, {new: true});
    }

    async findOne(query): Promise<RoomModel> {
        return this.RoomModel.findOne(query);
    }
}
