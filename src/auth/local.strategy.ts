import { Strategy as BaseLocalStrategy } from 'passport-local';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/entity/user.entity';

type PasswordOmitUser = Omit<User, 'password'>;

/**
 * @description usernameとpasswordを使った認証処理を行うクラス
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(BaseLocalStrategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(name: User['firstName'], pass: User['password']): Promise<PasswordOmitUser> {

    const user = await this.authService.validateUser(name, pass);

    if (!user) {

      throw new UnauthorizedException(); 
      
    }
    
    return user;
  }
}


