export class BaseUrlService {
  private baseUrl: string;

    constructor() {
        this.baseUrl = 'https://demoqa.com'; // This would come from your config
    }

    getFullUrl(path: string): string {
        return `${this.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    }

}