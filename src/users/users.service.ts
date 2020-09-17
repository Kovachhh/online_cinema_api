import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginUserDTO } from 'src/auth/dto/auth.dto';
import { CreateUserDTO } from './dto/user.dto';

import { UserModel } from './models/user.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserModel>) { }

    async findUser(userId): Promise<UserModel> {
        return this.userModel.find({_id: userId}).lean();
    }

    async loginUser(data: LoginUserDTO): Promise<UserModel> {
      return this.userModel.findOne({ username: data.username, password: data.password }).lean();
  }

    async createUser(createUserDto: CreateUserDTO) {
      let createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    }
    
    async findOneById(userId): Model<UserModel> {
      return this.userModel.findOne({ _id: userId });
    }

    async findOneByUsername(username): Model<UserModel> {
      return this.userModel.findOne({ username });
    }

}
