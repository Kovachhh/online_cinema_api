import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { UserModel } from "../models/user.model";

export class CreateUserDTO {  
    @IsNotEmpty()  
    @IsString()
    @MinLength(4, { message: 'Username is too short (4 characters min)' })
    @MaxLength(20, { message: 'Username is too long (20 characters max)' })
        username: UserModel['username'];
    @IsNotEmpty()  
    @IsString()
    @MinLength(8, { message: 'Password is too short (8 characters min)' })
    @MaxLength(20, { message: 'Password is too long (20 characters max)' })
        password: UserModel['password'];
    @IsNotEmpty() 
    @IsEmail()  
        email: UserModel['password'];
}

// export class UserDTO {  
//     @IsNotEmpty()  
//         id: string;
//     @IsNotEmpty()  
//         username: string;
//     @IsNotEmpty() 
//     @IsEmail()  
//         email: string;
// }

