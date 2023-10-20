import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;
  async login({ username, password }: LoginUserDto) {
    const _foundedUser = await this.entityManager.findOneBy(User, { username });
    if (!_foundedUser) throw new BadRequestException('账号不存在');
    if (_foundedUser.password !== password)
      throw new BadRequestException('密码错误');
    return _foundedUser;
  }
}
