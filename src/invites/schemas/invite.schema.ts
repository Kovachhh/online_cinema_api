import * as mongoose from 'mongoose';

export const InviteSchema = new mongoose.Schema({
     roomId: { type: String, ref: 'Room', required: true, unique: true},
     code: { type: String, default: null},
     status: { type: Boolean, default: false}
});