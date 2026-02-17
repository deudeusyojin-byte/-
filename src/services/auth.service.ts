import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  name: string;
  avatarColor: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly CURRENT_USER_KEY = 'tc_guest_session_v3';
  private readonly USERS_DB_KEY = 'tc_users_db';
  
  private router: Router = inject(Router);

  currentUser = signal<User | null>(null);

  constructor() {
    this.initializeGuestSession();
  }

  private initializeGuestSession() {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    } else {
      // Create a permanent guest identity
      this.createGuestUser();
    }
  }

  private createGuestUser() {
    const randomId = Math.floor(Math.random() * 10000);
    const newUser: User = {
      id: crypto.randomUUID(),
      username: `guest${randomId}`,
      name: `여행자 ${randomId}`,
      avatarColor: this.getRandomColor(),
      createdAt: Date.now()
    };
    
    this.currentUser.set(newUser);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
  }

  // Formerly logout, now just resets identity if needed, but we keep it simple
  resetGuest() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.createGuestUser();
    this.router.navigate(['/home']);
  }

  private getRandomColor(): string {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // --- Auth Methods ---

  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = this.getStoredUsers();
    // In a real app, perform secure password verification
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      const sessionUser: User = {
        id: user.id,
        username: user.username,
        name: user.name,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt
      };
      this.currentUser.set(sessionUser);
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionUser));
      return { success: true };
    }

    return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
  }

  async register(username: string, name: string, password: string): Promise<{ success: boolean; message?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = this.getStoredUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, message: '이미 존재하는 아이디입니다.' };
    }

    const newUser = {
      id: crypto.randomUUID(),
      username,
      name,
      password, // Note: Password hashing should be done in a real backend
      avatarColor: this.getRandomColor(),
      createdAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
    
    // Auto login
    const sessionUser: User = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      avatarColor: newUser.avatarColor,
      createdAt: newUser.createdAt
    };
    this.currentUser.set(sessionUser);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionUser));

    return { success: true };
  }

  private getStoredUsers(): any[] {
    const stored = localStorage.getItem(this.USERS_DB_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}