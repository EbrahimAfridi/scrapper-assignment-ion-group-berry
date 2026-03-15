import { Injectable, Logger } from '@nestjs/common';
import { KkrClient } from './kkr.client';
import { PortfolioService } from '../portfolio/portfolio.service';
import { transformCompany } from './transformers/company.transformer';
import { delay } from '../common/utils/delay.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly kkrClient: KkrClient,
    private readonly portfolioService: PortfolioService,
    private readonly configService: ConfigService,
  ) {}

  async run(): Promise<{ total: number; scraped: number }> {
    const delayMs = this.configService.get<number>('SCRAPER_DELAY_MS') ?? 1000;
    let currentPage = 1;
    let totalPages = 1;
    let totalHits = 0; // ← add this
    let scraped = 0;

    this.logger.log('Starting KKR portfolio scrape...');

    do {
      this.logger.log(`Scraping page ${currentPage}/${totalPages}...`);

      const data = await this.kkrClient.fetchPage(currentPage);
      totalPages = data.pages;
      totalHits = data.hits; // ← capture it here on every iteration (same value each time)

      for (const raw of data.results) {
        const company = transformCompany(raw);
        await this.portfolioService.upsert(company);
        scraped++;
      }

      currentPage++;

      if (currentPage <= totalPages) {
        await delay(delayMs);
      }
    } while (currentPage <= totalPages);

    this.logger.log(`Scrape complete. ${scraped} companies saved.`);
    return { total: totalHits, scraped }; // ← use the outer variable
  }
}
