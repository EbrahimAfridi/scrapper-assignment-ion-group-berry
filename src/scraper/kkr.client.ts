import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RawKkrCompany } from './transformers/company.transformer';

interface KkrPageResponse {
  success: boolean;
  hits: number;
  pages: number;
  startNumber: number;
  endNumber: number;
  results: RawKkrCompany[];
}

@Injectable()
export class KkrClient {
  private readonly logger = new Logger(KkrClient.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('KKR_BASE_URL') ?? '';
  }

  async fetchPage(page: number): Promise<KkrPageResponse> {
    const url = `${this.baseUrl}/content/kkr/sites/global/en/invest/portfolio/jcr:content/root/main-par/bioportfoliosearch.bioportfoliosearch.json`;

    const response = await axios.get<KkrPageResponse>(url, {
      params: {
        page,
        sortParameter: 'name',
        sortingOrder: 'asc',
        keyword: '',
        cfnode: '',
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; research-bot/1.0)',
      },
      timeout: 10000, // fail after 10 seconds
    });

    return response.data;
  }
}
