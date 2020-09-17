import { Document } from 'mongoose';
import { UserModel } from '../models/user.model';

export interface IUserLogin extends Document {
  readonly username: UserModel['username'];
  readonly password: UserModel['password'];
}