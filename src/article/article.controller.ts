import { Controller, Get, Param, Req, Session } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Request } from 'express';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.articleService.findOne(+id);
  }

  @Get(':id/view')
  async view(
    @Param('id') id: string,
    @Session() session: Request['session'],
    @Req() req: Request,
  ) {
    return await this.articleService.view(
      +id,
      session?.user?.username || req.ip,
    );
  }
}
