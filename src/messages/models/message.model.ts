import { Document } from 'mongoose';

export interface MessageModel extends Document {
    readonly _id: String;
    readonly roomId: String;
    readonly userId: String;
    readonly text: String;
    readonly date: Date;
}