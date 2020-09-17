import { Body, Controller, Get, Post,Headers, Req, UseGuards, Res, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDTO } from 'src/auth/dto/auth.dto';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateUserDTO } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {   

    }

    @Post() 
    async create(@Body() data: CreateUserDTO) {
        return this.usersService.createUser(data);
    }

    @Post('/login') 
    async login(@Res() res, @Body() data: LoginUserDTO){
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
            email: user.email,
            type: user.type
        });

        res.json({ data: result });
    }

    @Get('/me')
    @UseGuards(AuthGuard([]))
    async getMe(@Res() res, @Req() req){
        res.json(req.user)
    }
}
