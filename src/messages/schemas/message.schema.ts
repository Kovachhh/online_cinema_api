import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
     roomId: { type: String, ref: 'Room', required: true},
     userId: { type: String, ref: 'User', required: true},
     username: { type: String, required: true},
     text: { type: String, required: true, default: null},
     date: { type: Date, default: new Date().toISOString()}
});