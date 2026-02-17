import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GifService {
  // Public demo key for Tenor API (Commonly used for development)
  // In production, you should register for your own key at https://tenor.com/developer/keyregistration
  private readonly API_KEY = 'LIVDSRZULELA';
  private readonly BASE_URL = 'https://g.tenor.com/v1';
  
  // Fun Fallback DB (Safe, Cute, Reaction GIFs sourced from Tenor)
  // Used when API rate limit is hit or network fails
  private readonly FALLBACK_DB = [
    'https://media.tenor.com/P-W51XgKxQ4AAAAM/cat-happy.gif', // Happy Cat
    'https://media.tenor.com/t7rftXosoZYAAAAM/party-parrot-parrot.gif', // Party Parrot
    'https://media.tenor.com/15YIPV5XvowAAAAM/high-five-cat.gif', // High Five
    'https://media.tenor.com/p1_r0Zt92GgAAAAM/thumbs-up-pikachu.gif', // Thumbs Up
    'https://media.tenor.com/images/a521798e9d504e75a68d06746973e79e/tenor.gif', // Cheers
    'https://media.tenor.com/images/c6004b50033d4c391305417df8027725/tenor.gif', // Dancing
    'https://media.tenor.com/images/330588663806a6c11267812f80c6f1f3/tenor.gif', // Sad
    'https://media.tenor.com/images/4254b17a1075677d29668e168869c97c/tenor.gif', // Wow
  ];

  async searchGifs(query: string): Promise<string[]> {
    try {
      let url = '';
      if (!query.trim()) {
        url = `${this.BASE_URL}/trending?key=${this.API_KEY}&limit=18&media_filter=minimal`;
      } else {
        url = `${this.BASE_URL}/search?q=${encodeURIComponent(query)}&key=${this.API_KEY}&limit=18&media_filter=minimal`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
         console.warn('Tenor API Limit Hit or Error, using fallback.');
         return this.FALLBACK_DB;
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map((item: any) => 
           item.media[0].tinygif?.url || item.media[0].gif.url
        );
      }
      return this.FALLBACK_DB;
    } catch (error) {
      console.warn('Tenor API issue, using curated fun list:', error);
      return this.FALLBACK_DB;
    }
  }
}