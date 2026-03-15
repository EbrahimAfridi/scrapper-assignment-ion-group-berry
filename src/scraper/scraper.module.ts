import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { KkrClient } from './kkr.client';
import { PortfolioModule } from '../portfolio/portfolio.module';

@Module({
  imports: [PortfolioModule], // gives access to PortfolioService
  providers: [ScraperService, KkrClient],
  controllers: [ScraperController],
})
export class ScraperModule {}
