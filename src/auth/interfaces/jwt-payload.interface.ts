import { UserModel } from "src/users/models/user.model";

export interface IUserPayload {
    userId: UserModel['_id'];
    username: UserModel['username'];
    email: UserModel['email'];
    type: UserModel['type'];
}