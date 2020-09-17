import { IsNotEmpty } from "class-validator";
import { UserModel } from "src/users/models/user.model";

export class LoginUserDTO {  
    @IsNotEmpty()  
        readonly username: UserModel['username'];
    @IsNotEmpty()  
        readonly password: UserModel['password'];
}