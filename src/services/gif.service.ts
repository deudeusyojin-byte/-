import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifService {
  // Public demo key for Tenor API
  private readonly API_KEY = 'LIVDSRZULELA';
  private readonly BASE_URL = 'https://g.tenor.com/v1';
  
  // Local fallback DB in case API fails or hits limits
  private readonly FALLBACK_DB = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXN6eGh4bW54bW54bW54bW54bW54bW54bW54bW54bW54bW54biZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/3o7TKSjRrfIPjeiVyM/giphy.gif',
    'https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif',
    'https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif',
    'https://media.giphy.com/media/l1KdbHUPe27GQsJH2/giphy.gif',
    'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif',
    'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    'https://media.giphy.com/media/blSTtZTIj0mtW/giphy.gif',
    'https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif',
    'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
    'https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif'
  ];

  async searchGifs(query: string): Promise<string[]> {
    try {
      let url = '';
      if (!query.trim()) {
        url = `${this.BASE_URL}/trending?key=${this.API_KEY}&limit=20&media_filter=minimal`;
      } else {
        url = `${this.BASE_URL}/search?q=${encodeURIComponent(query)}&key=${this.API_KEY}&limit=20&media_filter=minimal`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Extract tinygif or gif url
        return data.results.map((item: any) => 
           item.media[0].tinygif?.url || item.media[0].gif.url
        );
      }
      return this.FALLBACK_DB; // No results -> Fallback
    } catch (error) {
      console.warn('Tenor API failed, using fallback:', error);
      return this.shuffle(this.FALLBACK_DB);
    }
  }

  private shuffle(array: string[]): string[] {
    return [...array].sort(() => 0.5 - Math.random());
  }
}