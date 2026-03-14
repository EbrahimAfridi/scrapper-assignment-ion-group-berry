import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PortfolioCompany,
  PortfolioCompanySchema,
} from './schemas/portfolio-company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PortfolioCompany.name, schema: PortfolioCompanySchema },
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PortfolioModule {}
