import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { User } from './user/entities/user.entity';
import { Article } from './article/entities/article.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          connectorPackage: 'mysql2',
          synchronize: true,
          poolSize: 10,
          entities: [User, Article],
          logging: true,
          host: configService.get('application.db.host'),
          port: configService.get('application.db.port'),
          username: configService.get('application.db.username'),
          password: configService.get('application.db.password'),
          database: configService.get('application.db.database'),
        };
      },
    }),
    RedisModule,
    UserModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
