import { transformCompany } from './company.transformer';

describe('transformCompany', () => {
  // A realistic raw API object matching what KKR actually returns
  const mockRawCompany = {
    name: '1-800 Contacts, Inc.',
    sortingName: '1-800 Contacts, Inc.',
    yoi: '2020',
    assetClass: 'Private Equity',
    industry: 'Consumer Discretionary',
    region: 'Americas',
    hq: 'Draper, Utah, United States',
    description: '<p>Leading online destination for contact lenses.</p>\n',
    logo: '/content/dam/kkr/portfolio/resized-logos/1800-contacts-logo-raw.png',
    url: 'www.1800contacts.com',
  };

  it('should correctly transform a normal company', () => {
    const result = transformCompany(mockRawCompany);

    expect(result.name).toBe('1-800 Contacts, Inc.');
    expect(result.yearOfInvestment).toBe('2020');
    expect(result.industry).toBe('Consumer Discretionary');
    expect(result.region).toBe('Americas');
    expect(result.headquarters).toBe('Draper, Utah, United States');
  });

  it('should generate a slug from the company name', () => {
    const result = transformCompany(mockRawCompany);
    expect(result.slug).toBe('1-800-contacts-inc');
  });

  it('should strip HTML tags from description', () => {
    const result = transformCompany(mockRawCompany);
    expect(result.description).toBe(
      'Leading online destination for contact lenses.',
    );
  });

  it('should convert relative logo path to absolute URL', () => {
    const result = transformCompany(mockRawCompany);
    expect(result.logoUrl).toBe(
      'https://www.kkr.com/content/dam/kkr/portfolio/resized-logos/1800-contacts-logo-raw.png',
    );
  });

  it('should normalize website URL without https prefix', () => {
    const result = transformCompany(mockRawCompany);
    expect(result.websiteUrl).toBe('https://www.1800contacts.com');
  });

  it('should return null for empty website URL', () => {
    const result = transformCompany({ ...mockRawCompany, url: '' });
    expect(result.websiteUrl).toBeNull();
  });

  it('should split comma-separated assetClass into array', () => {
    const result = transformCompany({
      ...mockRawCompany,
      assetClass: 'Tech Growth, Private Equity',
    });
    expect(result.assetClass).toEqual(['Tech Growth', 'Private Equity']);
  });

  it('should wrap single assetClass in array', () => {
    const result = transformCompany(mockRawCompany);
    expect(result.assetClass).toEqual(['Private Equity']);
  });

  it('should return empty array when assetClass is missing', () => {
    const result = transformCompany({ ...mockRawCompany, assetClass: null });
    expect(result.assetClass).toEqual([]);
  });

  it('should return null for missing description', () => {
    const result = transformCompany({ ...mockRawCompany, description: null });
    expect(result.description).toBeNull();
  });

  it('should keep URL unchanged if it already has https', () => {
    const result = transformCompany({
      ...mockRawCompany,
      url: 'https://www.1800contacts.com',
    });
    expect(result.websiteUrl).toBe('https://www.1800contacts.com');
  });
});
