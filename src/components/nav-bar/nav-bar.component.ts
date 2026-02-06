import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4 md:gap-8">
          <a routerLink="/home" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-mono font-bold text-xl shadow-lg transition-transform group-hover:scale-105">T</div>
            <span class="font-bold text-xl tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors hidden sm:block">TimeCapsuffle</span>
          </a>
          
          <div class="hidden md:flex gap-1">
            <a routerLink="/home" routerLinkActive="bg-gray-100 text-gray-900" [routerLinkActiveOptions]="{exact: true}" class="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">홈</a>
            @if (authService.currentUser()) {
              <a routerLink="/home" class="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">보관함</a>
            }
          </div>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-5">
          @if (authService.currentUser()) {
            <div class="flex items-center pl-6 border-l border-gray-200 gap-4">
              <div class="flex flex-col items-end hidden sm:flex text-right">
                <span class="text-sm font-bold text-gray-900">{{ authService.currentUser()?.name }}</span>
                <span class="text-[10px] text-gray-400 font-mono">Member</span>
              </div>
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white"
                [style.background-color]="authService.currentUser()?.avatarColor"
              >
                {{ authService.currentUser()?.name?.charAt(0) }}
              </div>
              <button (click)="authService.logout()" class="text-xs font-medium text-gray-400 hover:text-red-500 hover:underline underline-offset-4 transition">
                로그아웃
              </button>
            </div>
          } @else {
             <div class="flex items-center gap-3">
               <a routerLink="/login" class="text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 transition">로그인</a>
               <a routerLink="/login" class="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">시작하기</a>
             </div>
          }
        </div>

        <!-- Mobile Menu Button -->
        <button (click)="toggleMenu()" class="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
           <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              @if (isMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              }
           </svg>
        </button>
      </div>

      <!-- Mobile Dropdown -->
      @if (isMenuOpen()) {
        <div class="md:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-lg animate-fade-in">
           <div class="p-4 flex flex-col gap-2">
              <a routerLink="/home" (click)="toggleMenu()" class="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">홈</a>
              @if (authService.currentUser()) {
                <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100 mb-2">
                   <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    [style.background-color]="authService.currentUser()?.avatarColor"
                   >
                    {{ authService.currentUser()?.name?.charAt(0) }}
                   </div>
                   <span class="font-bold text-gray-900">{{ authService.currentUser()?.name }}</span>
                </div>
                <button (click)="authService.logout()" class="text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium">로그아웃</button>
              } @else {
                <a routerLink="/login" (click)="toggleMenu()" class="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">로그인</a>
                <a routerLink="/login" (click)="toggleMenu()" class="px-4 py-3 rounded-lg bg-indigo-600 text-white font-bold text-center">시작하기</a>
              }
           </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class NavBarComponent {
  authService = inject(AuthService);
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
}