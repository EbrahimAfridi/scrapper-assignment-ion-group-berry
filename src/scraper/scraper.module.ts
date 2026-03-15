import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { KkrClient } from './kkr.client';
import { PortfolioModule } from '../portfolio/portfolio.module';

@Module({
  imports: [PortfolioModule], // gives access to PortfolioService
  providers: [ScraperService, KkrClient],
})
export class ScraperModule {}
