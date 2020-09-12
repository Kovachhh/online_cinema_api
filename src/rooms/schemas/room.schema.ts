import * as mongoose from 'mongoose';

export const RoomSchema = new mongoose.Schema({
     name: { type: String, required: true},
     url: { type: String },
     playerStatus: { type: Boolean, default: false },
     playedTime: { type: Number, default: 0 },
     membersId: { type: [String], ref: 'User' },
     owner: { type: String, ref: 'User', required: true }
});