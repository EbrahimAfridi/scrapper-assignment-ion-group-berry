import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'portfolio_companies' })
export class PortfolioCompany extends Document {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  sortingName: string;

  @Prop()
  yearOfInvestment: string;

  @Prop({ type: [String], index: true })
  assetClass: string[];

  @Prop({ index: true })
  industry: string;

  @Prop({ index: true })
  region: string;

  @Prop()
  headquarters: string;

  @Prop()
  description: string;

  @Prop()
  logoUrl: string;

  @Prop()
  websiteUrl: string;

  @Prop({ required: true })
  scrapedAt: Date;
}

export const PortfolioCompanySchema =
  SchemaFactory.createForClass(PortfolioCompany);
