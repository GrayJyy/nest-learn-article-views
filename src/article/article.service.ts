import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async findOne(id: number) {
    return await this.entityManager.findOneBy(Article, { id });
  }

  async view(id: number) {
    const _foundedArticle = await this.entityManager.findOneBy(Article, { id });
    _foundedArticle.viewCount++;
    await this.entityManager.save(_foundedArticle);
    return new HttpException(
      { count: _foundedArticle.viewCount },
      HttpStatus.OK,
    );
  }
}
