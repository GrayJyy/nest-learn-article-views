import { Body, Controller, Post, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Session() session: Request['session'],
  ) {
    const _user = await this.userService.login(loginUserDto);
    session.user = {
      username: _user.username,
    };
    return _user;
  }
}
