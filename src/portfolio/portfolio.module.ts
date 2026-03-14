import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PortfolioCompany,
  PortfolioCompanySchema,
} from './schemas/portfolio-company.schema';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PortfolioCompany.name, schema: PortfolioCompanySchema },
    ]),
  ],
  providers: [PortfolioService],
  controllers: [PortfolioController],
  exports: [PortfolioService], // exported so ScraperModule can use it
})
export class PortfolioModule {}
