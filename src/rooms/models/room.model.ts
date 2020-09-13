import { Document } from 'mongoose';

export interface RoomModel extends Document {
    readonly _id: string;
    readonly name: string;
    readonly url: string;
    readonly playerStatus: boolean;
    readonly playedTime: number;
    readonly membersId: string[];
    readonly owner: string;
    
}