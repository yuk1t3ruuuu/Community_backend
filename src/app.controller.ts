import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from './entity/user.entity';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

type PasswordOmitUser = Omit<User, "password">

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: { user: PasswordOmitUser }) {
    const user = req.user;

    return this.authService.login(req.user);
  }




  /**
   * @description JWT認証を用いたサンプルAPI
   */
  @UseGuards(AuthGuard('jwt')) 
  @Get('profile')
  getProfile(@Request() req: { user: PasswordOmitUser }) {
    const user = req.user;

    return req.user;
  }
}




