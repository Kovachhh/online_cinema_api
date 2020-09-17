import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

import { IUserPayload } from './interfaces/jwt-payload.interface';
import { JWT } from './interfaces/jwt-token.interface';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ){}


    async validateToken(token: JWT['token']): Promise<IUserPayload> {
        const jwtPayload = await this.jwtService.verify(token);
        return jwtPayload;
    }

    async createToken(data: IUserPayload ): Promise<JWT> {
        const expiresIn: string = process.env.EXPIRES_TOKEN;
        const token: string = this.jwtService.sign(data, { expiresIn: `${expiresIn} days` });

        const result: any = { expiredAt: moment().add(expiresIn, 'days').valueOf(), token };
        return result;
    }
}
