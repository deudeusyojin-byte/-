import { Injectable, signal } from '@angular/core';

export interface CharacterData {
  vx: number; // Velocity X
  vy: number; // Velocity Y
  state: 'idle' | 'run' | 'jump';
  direction: 'left' | 'right';
  color: string; // Character tint or indicator color
  playerId: string; // To identify who controls this
}

export interface CapsuleItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'drawing' | 'gif' | 'character' | 'sticker';
  content: string; // URL or Base64 (For character, this is the sprite sheet URL)
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  authorId: string;
  characterData?: CharacterData; // Only for type='character'
}

export interface Capsule {
  id: string;
  name: string;
  duration: string; // '1d', '1w', '1m', '1y'
  password?: string; // Optional password for private joint capsules
  type: 'system' | 'user';
  createdDate: string;
  creatorId: string; // 'system' or userId
  items: CapsuleItem[];
  archivedDate?: string; // If present, it's an archived capsule
}

@Injectable({
  providedIn: 'root'
})
export class CapsuleService {
  private readonly CAPSULES_KEY = 'tc_capsules';
  private readonly SYSTEM_CAPSULES_KEY = 'tc_system_capsules';
  private readonly ARCHIVES_KEY = 'tc_archives';

  capsules = signal<Capsule[]>([]);
  archives = signal<Capsule[]>([]);

  constructor() {
    this.loadCapsules();
    this.loadArchives();
  }

  private loadCapsules() {
    const stored = localStorage.getItem(this.CAPSULES_KEY);
    if (stored) {
      this.capsules.set(JSON.parse(stored));
    }
  }
  
  private loadArchives() {
    const stored = localStorage.getItem(this.ARCHIVES_KEY);
    if (stored) {
       // Sort archives by date desc
       const list: Capsule[] = JSON.parse(stored);
       list.sort((a, b) => new Date(b.archivedDate!).getTime() - new Date(a.archivedDate!).getTime());
       this.archives.set(list);
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
    // If it's archived, it's already expired effectively, but we use archivedDate for display
    if (capsule.archivedDate) return new Date(capsule.archivedDate);
    
    const created = new Date(capsule.createdDate).getTime();
    const duration = this.getDurationInMillis(capsule.duration);
    return new Date(created + duration);
  }

  isExpired(capsule: Capsule): boolean {
    if (capsule.archivedDate) return true;
    const now = new Date().getTime();
    const expireTime = this.getExpirationDate(capsule).getTime();
    return now >= expireTime;
  }

  // --- User Capsule Logic ---

  createCapsule(name: string, duration: string, creatorId: string, password?: string): string {
    const newCapsule: Capsule = {
      id: crypto.randomUUID(),
      name,
      duration,
      password: password || undefined,
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
    
    const storedSys = localStorage.getItem(this.SYSTEM_CAPSULES_KEY);
    let sysCapsules: Capsule[] = storedSys ? JSON.parse(storedSys) : [];
    
    let capsule = sysCapsules.find(c => c.id === id);

    if (!capsule) {
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
    // 1. Check Archives first
    const archives = this.archives();
    const archived = archives.find(c => c.id === id);
    if (archived) return archived;

    // 2. Check System
    if (id.startsWith('sys_')) {
      const storedSys = localStorage.getItem(this.SYSTEM_CAPSULES_KEY);
      const sysCapsules: Capsule[] = storedSys ? JSON.parse(storedSys) : [];
      return sysCapsules.find(c => c.id === id);
    }

    // 3. Check User
    this.loadCapsules();
    return this.capsules().find(c => c.id === id);
  }

  updateCapsuleItems(capsuleId: string, items: CapsuleItem[]) {
    const capsule = this.getCapsule(capsuleId);
    if (capsule && this.isExpired(capsule)) return;

    this.saveItemsInternal(capsuleId, items);
  }

  addItemToCapsule(capsuleId: string, item: CapsuleItem) {
    const capsule = this.getCapsule(capsuleId);
    if (capsule && this.isExpired(capsule)) return;

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

  // --- Archive & Reset Logic ---

  archiveAndResetCapsule(capsuleId: string) {
    const target = this.getCapsule(capsuleId);
    if (!target) return;

    // 1. Create Archive Copy
    const archivedCapsule: Capsule = {
      ...target,
      id: `archive_${Date.now()}_${target.id}`, // Unique ID for archive
      archivedDate: new Date().toISOString(),
      name: `${target.name} (보관됨)`,
      items: JSON.parse(JSON.stringify(target.items)) // Deep copy
    };

    // Save to Archives
    const currentArchives = this.archives();
    const newArchives = [archivedCapsule, ...currentArchives];
    this.archives.set(newArchives);
    localStorage.setItem(this.ARCHIVES_KEY, JSON.stringify(newArchives));

    // 2. Reset the Original Capsule (Initialize)
    const now = new Date().toISOString();

    if (capsuleId.startsWith('sys_')) {
      // For System Capsules: Clear items, reset date
      const storedSys = localStorage.getItem(this.SYSTEM_CAPSULES_KEY);
      let sysCapsules: Capsule[] = storedSys ? JSON.parse(storedSys) : [];
      const index = sysCapsules.findIndex(c => c.id === capsuleId);
      if (index !== -1) {
        sysCapsules[index].items = [];
        sysCapsules[index].createdDate = now;
        localStorage.setItem(this.SYSTEM_CAPSULES_KEY, JSON.stringify(sysCapsules));
      }
    } else {
      // For User Capsules: Just reset content for reuse or could delete. 
      // User request implies "initialize", so we clear it.
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