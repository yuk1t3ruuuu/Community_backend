import bcrypt = require('bcrypt');
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Gender, User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';


const scrypt = promisify(_scrypt);
type PasswordOmitUser = Omit<User, 'password'>;

interface JWTPayload  {
  userId: User['id'];
  username: User['firstName'];
}


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService,
              private readonly configService: ConfigService) {}

  async validateUser(name: User['firstName'], pass: User['password']): Promise<PasswordOmitUser | null> {
    const user = await this.usersService.findOneForName(name); // DBからUserを取得

    if (user) {
      const [savedSalt, savedHash] = user.password.split('.');
      const hashToCompare = (await scrypt(pass, savedSalt, 32)) as Buffer;
  
      if (savedHash === hashToCompare.toString('hex')) {
          const { password, ...result } = user;
          return result;
      }
  }
    return null;
  }
  
 
  async login(user: PasswordOmitUser) {
    const payload: JWTPayload = { userId: user.id, username: user.firstName };

    const key = this.configService.get<string>('JWT_SECRET_KEY');
    return {
      access_token: this.jwtService.sign(payload,{ privateKey: key}),
    };
  }




  async siginup(firstName: string, lastName: string,email: string, password: string, description: string,
                 image: string, gender: Gender) {
    const users = await this.usersService.findEmail(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.createUser(firstName, lastName, email, result, description, gender, image);
  
    return user;
  }


  async signin(email: string, password: string) {
    const [user] = await this.usersService.findEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
      
    }
    return user;
  }

}




