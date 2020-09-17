import { Document } from 'mongoose';
import { ADMIN_TYPE, MEMBER_TYPE } from 'src/utils/enum.constants';

export interface UserModel extends Document {
    readonly _id: string;
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly type: typeof ADMIN_TYPE | typeof MEMBER_TYPE; //  type (role) user on platform
}