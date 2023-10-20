import { LoginUserDto } from 'src/user/dto/login-user.dto';

declare module 'express-session' {
  interface Session {
    user: Pick<LoginUserDto, 'username'>;
  }
}
