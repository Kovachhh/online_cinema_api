import { Document } from 'mongoose';

export interface InviteModel extends Document {
    readonly roomId: string;
    readonly code: string;
    readonly status: boolean;
}