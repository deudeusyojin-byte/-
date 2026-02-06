import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatarColor: string;
  provider: 'email'; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'tc_users';
  private readonly CURRENT_USER_KEY = 'tc_current_user';
  
  private router = inject(Router);

  currentUser = signal<User | null>(null);

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  // --- Email Login ---

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      this.setCurrentUser(user);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const users = this.getUsers();
    if (users.some(u => u.email === email)) {
      return false; // Email taken
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      avatarColor: this.getRandomColor(),
      provider: 'email'
    };

    this.saveUser(newUser);
    this.setCurrentUser(newUser);
    return true;
  }

  // --- Common ---

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/login']);
  }

  private setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
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