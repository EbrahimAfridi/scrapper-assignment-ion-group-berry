import { CreatePortfolioCompanyDto } from '../../portfolio/dto/create-portfolio-company.dto';
import { stripHtml } from 'string-strip-html';
import slugify from 'slugify';

export function transformCompany(raw: any): CreatePortfolioCompanyDto {
  return {
    slug: slugify(raw.name, { lower: true, strict: true }),
    name: raw.name?.trim() ?? null,
    sortingName: raw.sortingName?.trim() ?? null,
    yearOfInvestment: raw.yoi ?? null,

    // "Tech Growth, Private Equity" → ["Tech Growth", "Private Equity"]
    assetClass: raw.assetClass
      ? raw.assetClass.split(',').map((s: string) => s.trim())
      : [],

    industry: raw.industry?.trim() ?? null,
    region: raw.region?.trim() ?? null,
    headquarters: raw.hq?.trim() ?? null,

    // Strip <p> tags from description
    description: raw.description
      ? stripHtml(raw.description).result.trim()
      : null,

    // Make logo URL absolute
    logoUrl: raw.logo ? `https://www.kkr.com${raw.logo}` : null,

    websiteUrl: normalizeUrl(raw.url),
    scrapedAt: new Date(),
  };
}

function normalizeUrl(url: string): string | null {
  if (!url || url.trim() === '') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
