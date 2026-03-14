import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class KkrClient {
  private readonly logger = new Logger(KkrClient.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    const baseUrl = this.configService.get<string>('KKR_BASE_URL');
    if (!baseUrl) {
      throw new Error('KKR_BASE_URL is not defined in configuration');
    }
    this.baseUrl = baseUrl;
  }

  async fetchPage(
    page: number,
  ): Promise<{ results: any[]; pages: number; hits: number }> {
    const url = `${this.baseUrl}/content/kkr/sites/global/en/invest/portfolio/jcr:content/root/main-par/bioportfoliosearch.bioportfoliosearch.json`;

    const response = await axios.get(url, {
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
