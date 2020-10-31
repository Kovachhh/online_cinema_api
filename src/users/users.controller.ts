import { Body, Controller, Get, Post,Headers, Req, UseGuards, Res, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDTO } from 'src/auth/dto/auth.dto';
import { ADMIN_TYPE, MEMBER_TYPE } from 'src/utils/enum.constants';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateUserDTO } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService
    ) {   

    }

    @Post() 
    async create(@Body() data: CreateUserDTO) {
        const { username, email, password } = data;
        return this.usersService.createUser({username, email, password, type: MEMBER_TYPE});
    }

    @Post('/login') 
    async login(@Res() res, @Body() data: LoginUserDTO){
        try{
            const user = await this.usersService.loginUser(data);

            if(!user) {
                throw new NotFoundException({
                    statusCode: 404,
                    error: "Login or password is wrong."
                });
            }

            const result = await this.authService.createToken({ 
                userId: user._id,
                username: user.username,
                type: user.type
            });

            res.json({ data: result });
        }catch(e){
        console.log(e)
        res.responseException({message: e.response, status: e.status});
        }
    }

    @UseGuards(AuthGuard([MEMBER_TYPE, ADMIN_TYPE]))
    @Get('/me')
    async getMe(@Res() res, @Req() req){
        try{
            const user = await this.usersService.getMe(req.user.userId);
            res.json({data: user});
        }catch(e){
            console.log(e)
            res.responseException({message: e.response, status: e.status});
        }
    }
}
