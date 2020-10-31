import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { InviteModel } from './models/invite.model';

@Injectable()
export class InvitesService {
    constructor(@InjectModel('Invite') private readonly inviteModel: Model<InviteModel>) { }

    async findAll(): Promise<InviteModel[]> {
        return this.inviteModel.find().lean();
    }

    async findInvite(query): Promise<InviteModel> {
        return this.inviteModel.findOne(query).lean();
    }

    async addRoomInvite(roomId): Promise<InviteModel> {
        return new this.inviteModel(roomId).save();
    }

    async updateInvite(roomId, data): Promise<InviteModel> {
        return this.inviteModel.findOneAndUpdate(roomId, { code: data.code, status: data.status }, {new: true});
    }

    async deleteInvite(roomId): Promise<InviteModel> {
        return this.inviteModel.findOneAndRemove(roomId);
    }
}
