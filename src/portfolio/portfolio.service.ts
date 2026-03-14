import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PortfolioCompany } from './schemas/portfolio-company.schema';
import { CreatePortfolioCompanyDto } from './dto/create-portfolio-company.dto';
import { QueryPortfolioDto } from './dto/query-portfolio.dto';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    @InjectModel(PortfolioCompany.name)
    private readonly companyModel: Model<PortfolioCompany>,
  ) {}

  // Upsert = insert if new, update if exists
  async upsert(dto: CreatePortfolioCompanyDto): Promise<void> {
    await this.companyModel.findOneAndUpdate(
      { slug: dto.slug }, // find by unique slug
      { $set: dto }, // update all fields
      { upsert: true, new: true }, // create if not found
    );
  }

  async findAll(query: QueryPortfolioDto): Promise<PortfolioCompany[]> {
    const filter: Record<string, any> = {};

    if (query.assetClass) {
      // assetClass is an array in DB, this checks if array contains the value
      filter.assetClass = { $in: [query.assetClass] };
    }
    if (query.industry) {
      filter.industry = query.industry;
    }
    if (query.region) {
      filter.region = query.region;
    }
    if (query.keyword) {
      // Case-insensitive search across name and description
      filter.$or = [
        { name: { $regex: query.keyword, $options: 'i' } },
        { description: { $regex: query.keyword, $options: 'i' } },
      ];
    }

    return this.companyModel.find(filter).sort({ name: 1 }).exec();
  }

  async count(): Promise<number> {
    return this.companyModel.countDocuments().exec();
  }
}
