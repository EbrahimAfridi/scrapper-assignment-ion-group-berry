export class CreatePortfolioCompanyDto {
  slug: string;
  name: string;
  sortingName: string;
  yearOfInvestment: string | null;
  assetClass: string[];
  industry: string | null;
  region: string | null;
  headquarters: string | null;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  scrapedAt: Date;
}
