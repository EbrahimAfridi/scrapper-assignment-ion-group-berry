import { Controller, Get, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { QueryPortfolioDto } from './dto/query-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  findAll(@Query() query: QueryPortfolioDto) {
    return this.portfolioService.findAll(query);
  }

  @Get('count')
  count() {
    return this.portfolioService.count();
  }
}
