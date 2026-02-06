import { Injectable, signal } from '@angular/core';

export interface CapsuleItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'drawing' | 'gif';
  content: string; // URL or Base64
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  authorId: string;
}

export interface Capsule {
  id: string;
  name: string;
  duration: string; // '1d', '1w', '1m', '1y'
  type: 'system' | 'user';
  createdDate: string;
  creatorId: string; // 'system' or userId
  items: CapsuleItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CapsuleService {
  private readonly CAPSULES_KEY = 'tc_capsules';
  private readonly SYSTEM_CAPSULES_KEY = 'tc_system_capsules';

  capsules = signal<Capsule[]>([]);

  constructor() {
    this.loadCapsules();
  }

  private loadCapsules() {
    // Load User Capsules
    const stored = localStorage.getItem(this.CAPSULES_KEY);
    if (stored) {
      this.capsules.set(JSON.parse(stored));
    }
  }

  // --- Helper Methods ---
  
  getDurationInMillis(duration: string): number {
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    
    switch (duration) {
      case '1d': return oneDay;
      case '1w': return 7 * oneDay;
      case '1m': return 30 * oneDay;
      case '1y': return 365 * oneDay;
      default: return oneDay;
    }
  }

  getExpirationDate(capsule: Capsule): Date {
    const created = new Date(capsule.createdDate).getTime();
    const duration = this.getDurationInMillis(capsule.duration);
    return new Date(created + duration);
  }

  isExpired(capsule: Capsule): boolean {
    const now = new Date().getTime();
    const expireTime = this.getExpirationDate(capsule).getTime();
    return now >= expireTime;
  }

  // --- User Capsule Logic ---

  createCapsule(name: string, duration: string, creatorId: string): string {
    const newCapsule: Capsule = {
      id: crypto.randomUUID(),
      name,
      duration,
      type: 'user',
      createdDate: new Date().toISOString(),
      creatorId,
      items: []
    };

    const current = this.capsules();
    const updated = [newCapsule, ...current];
    this.capsules.set(updated);
    this.saveUserCapsules(updated);
    return newCapsule.id;
  }

  // --- System Capsule Logic ---

  getSystemCapsuleId(duration: '1d' | '1w' | '1m' | '1y'): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    
    // Deterministic ID generation based on time periods
    if (duration === '1d') return `sys_1d_${year}_${month}_${date}`;
    
    if (duration === '1w') {
      const oneJan = new Date(year, 0, 1);
      const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
      return `sys_1w_${year}_w${week}`;
    }
    
    if (duration === '1m') return `sys_1m_${year}_${month}`;
    if (duration === '1y') return `sys_1y_${year}`;
    
    return '';
  }

  getSystemCapsule(duration: '1d' | '1w' | '1m' | '1y'): Capsule {
    const id = this.getSystemCapsuleId(duration);
    
    // Try to find in storage first
    const storedSys = localStorage.getItem(this.SYSTEM_CAPSULES_KEY);
    let sysCapsules: Capsule[] = storedSys ? JSON.parse(storedSys) : [];
    
    let capsule = sysCapsules.find(c => c.id === id);

    if (!capsule) {
      // Create fresh system capsule
      const names = {
        '1d': '24시간 공개 캡슐',
        '1w': '7일 공개 캡슐',
        '1m': '30일 공개 캡슐',
        '1y': '365일 공개 캡슐'
      };

      capsule = {
        id,
        name: names[duration],
        duration,
        type: 'system',
        createdDate: new Date().toISOString(),
        creatorId: 'system',
        items: []
      };
      
      sysCapsules.push(capsule);
      localStorage.setItem(this.SYSTEM_CAPSULES_KEY, JSON.stringify(sysCapsules));
    }

    return capsule;
  }

  // --- Shared Logic ---

  getCapsule(id: string): Capsule | undefined {
    // Check if it's a system ID
    if (id.startsWith('sys_')) {
      const storedSys = localStorage.getItem(this.SYSTEM_CAPSULES_KEY);
      const sysCapsules: Capsule[] = storedSys ? JSON.parse(storedSys) : [];
      return sysCapsules.find(c => c.id === id);
    }

    // Otherwise check user capsules
    this.loadCapsules(); // Sync
    return this.capsules().find(c => c.id === id);
  }

  updateCapsuleItems(capsuleId: string, items: CapsuleItem[]) {
    // Check expiration before updating (unless it's a reset action, but here we just check generally)
    // For reset, we will use a dedicated method
    const capsule = this.getCapsule(capsuleId);
    if (capsule && this.isExpired(capsule)) {
       return; // Read-only mode
    }

    this.saveItemsInternal(capsuleId, items);
  }

  addItemToCapsule(capsuleId: string, item: CapsuleItem) {
    const capsule = this.getCapsule(capsuleId);
    if (capsule && this.isExpired(capsule)) {
       return; // Read-only mode
    }

    if (capsuleId.startsWith('sys_')) {
      const storedSys = localStorage.getItem(this.SYSTEM_CAPSULES_KEY);
      let sysCapsules: Capsule[] = storedSys ? JSON.parse(storedSys) : [];
      const index = sysCapsules.findIndex(c => c.id === capsuleId);
      if (index !== -1) {
        sysCapsules[index].items.push(item);
        localStorage.setItem(this.SYSTEM_CAPSULES_KEY, JSON.stringify(sysCapsules));
      }
    } else {
      const all = this.capsules();
      const index = all.findIndex(c => c.id === capsuleId);
      if (index !== -1) {
        all[index].items.push(item);
        this.capsules.set([...all]);
        this.saveUserCapsules(all);
      }
    }
  }

  resetCapsule(capsuleId: string) {
    // 0. Safety Check: Must be expired to reset
    const target = this.getCapsule(capsuleId);
    if (!target) return;
    if (!this.isExpired(target)) {
        console.warn('Cannot reset active capsule');
        return; 
    }

    // 1. Reset Items to empty
    // 2. Reset Created Date to NOW
    const now = new Date().toISOString();

    if (capsuleId.startsWith('sys_')) {
      const storedSys = localStorage.getItem(this.SYSTEM_CAPSULES_KEY);
      let sysCapsules: Capsule[] = storedSys ? JSON.parse(storedSys) : [];
      const index = sysCapsules.findIndex(c => c.id === capsuleId);
      if (index !== -1) {
        sysCapsules[index].items = [];
        sysCapsules[index].createdDate = now;
        localStorage.setItem(this.SYSTEM_CAPSULES_KEY, JSON.stringify(sysCapsules));
      }
    } else {
      const all = this.capsules();
      const index = all.findIndex(c => c.id === capsuleId);
      if (index !== -1) {
        all[index].items = [];
        all[index].createdDate = now;
        this.capsules.set([...all]);
        this.saveUserCapsules(all);
      }
    }
  }

  private saveItemsInternal(capsuleId: string, items: CapsuleItem[]) {
    if (capsuleId.startsWith('sys_')) {
      const storedSys = localStorage.getItem(this.SYSTEM_CAPSULES_KEY);
      let sysCapsules: Capsule[] = storedSys ? JSON.parse(storedSys) : [];
      const index = sysCapsules.findIndex(c => c.id === capsuleId);
      if (index !== -1) {
        sysCapsules[index].items = items;
        localStorage.setItem(this.SYSTEM_CAPSULES_KEY, JSON.stringify(sysCapsules));
      }
    } else {
      const all = this.capsules();
      const index = all.findIndex(c => c.id === capsuleId);
      if (index !== -1) {
        all[index].items = items;
        this.capsules.set([...all]);
        this.saveUserCapsules(all);
      }
    }
  }

  private saveUserCapsules(capsules: Capsule[]) {
    localStorage.setItem(this.CAPSULES_KEY, JSON.stringify(capsules));
  }
}