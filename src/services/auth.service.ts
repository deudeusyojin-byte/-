import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string; // Unique ID (e.g., hero99)
  name: string;     // Display Name (e.g., 김철수)
  passwordHash?: string; // Storing Hash only
  avatarColor: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'tc_users_v2'; // Changed key to avoid conflict with old email data
  private readonly CURRENT_USER_KEY = 'tc_session_v2';
  
  private router = inject(Router);

  currentUser = signal<User | null>(null);

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  // --- Crypto Helper (Client-side Hashing Simulation) ---
  
  private async hashPassword(password: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `$sha256$${hashHex}`; // Simulating a structured hash format
  }

  // --- Authentication Methods ---

  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user || !user.passwordHash) {
      // Simulate delay for security (prevent timing attacks)
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }

    const inputHash = await this.hashPassword(password);
    
    if (inputHash === user.passwordHash) {
      this.createSession(user);
      return { success: true };
    }

    return { success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' };
  }

  async register(username: string, name: string, password: string): Promise<{ success: boolean; message?: string }> {
    const users = this.getUsers();
    
    // 1. Check ID uniqueness
    if (users.some(u => u.username === username)) {
      return { success: false, message: '이미 사용 중인 아이디입니다.' };
    }

    // 2. Hash Password
    const passwordHash = await this.hashPassword(password);

    // 3. Create User
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      name,
      passwordHash,
      avatarColor: this.getRandomColor(),
      createdAt: Date.now()
    };

    this.saveUser(newUser);
    this.createSession(newUser); // Auto login after register
    return { success: true };
  }

  // --- Session Management ---

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/login']);
  }

  private createSession(user: User) {
    // In a real app, we would store a session ID, not the whole user object.
    // For this client-only demo, we store the user info (excluding sensitive data is better, but simplified here).
    const sessionUser = { ...user };
    delete sessionUser.passwordHash; // Never keep hash in session storage if possible
    
    this.currentUser.set(sessionUser);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionUser));
  }

  private getUsers(): User[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private getRandomColor(): string {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}