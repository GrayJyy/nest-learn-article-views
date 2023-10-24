import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Article } from './entities/article.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;
  @Inject(RedisService)
  private readonly redisService: RedisService;

  async findOne(id: number) {
    return await this.entityManager.findOneBy(Article, { id });
  }

  async view(id: number, userId: string) {
    const { viewCount, ...rest } = await this.redisService.hashGet(
      `article_${id}`,
    );
    if (viewCount === undefined) {
      const _foundedArticle = await this.entityManager.findOneBy(Article, {
        id,
      });
      _foundedArticle.viewCount++;
      await this.entityManager.update(
        Article,
        { id },
        {
          viewCount: +_foundedArticle.viewCount,
        },
      );
      await this.redisService.hashSet(`article_${id}`, {
        viewCount: _foundedArticle.viewCount,
        likeCount: _foundedArticle.likeCount,
        collectCount: _foundedArticle.collectCount,
      });
      await this.redisService.set(`user_${userId}_article_${id}`, 1, 3);
      return _foundedArticle.viewCount;
    }
    const _flag = await this.redisService.get(`user_${userId}_article_${id}`);
    if (_flag) return viewCount;
    await this.redisService.hashSet(`article_${id}`, {
      ...rest,
      viewCount: +viewCount + 1,
    });
    return +viewCount + 1;
  }

  async flushRedisToDb() {
    const keys = await this.redisService.keys(`article_*`);
    for (const iterator of keys) {
      const id = iterator.split('_')[1];
      const { viewCount } = await this.redisService.hashGet(iterator);
      await this.entityManager.update(
        Article,
        { id },
        { viewCount: +viewCount },
      );
    }
  }
}
