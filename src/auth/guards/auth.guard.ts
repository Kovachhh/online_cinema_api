import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, mixin } from '@nestjs/common';
import { get } from 'lodash';
import { AuthService } from '../auth.service';


export function AuthGuard(types: string[]) {
  @Injectable()
  class Guard implements CanActivate {
    constructor( private AuthService: AuthService) {}
    
    async canActivate(context: ExecutionContext ): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
    
      // check exist and valid authorization header
      const token = get(req, 'headers.authorization', false);
      if(!token) throw new UnauthorizedException();
      const user: any = await this.AuthService.validateToken(token);
      
      if(user) {
        // check roles
        if( types.length == 0 || types.includes(user.type)) {
          req.user = user;
          return true;
        }
      }

    }
  }

  return mixin(Guard);
}