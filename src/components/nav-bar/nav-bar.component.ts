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
            <!-- Custom Graphic Logo: Capsule with Memory -->
            <div class="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:rotate-12 duration-500">
               <!-- SVG Icon -->
               <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-sm overflow-visible" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <!-- Capsule Body (Tilted) -->
                  <g transform="rotate(-15 50 50)">
                    <!-- Outer Shell -->
                    <rect x="25" y="10" width="50" height="80" rx="25" class="stroke-stone-800" stroke-width="6" fill="white"/>
                    <!-- Inner Shine (Reflection) -->
                    <path d="M38 20 Q 50 20 62 25" class="stroke-stone-200" stroke-width="4" />
                    <!-- The Memory (Photo/Paper) Floating Inside -->
                    <rect x="35" y="45" width="30" height="35" rx="4" class="fill-indigo-500 stroke-indigo-600" stroke-width="0" transform="rotate(5 50 62.5)"/>
                    <!-- Small detail on memory -->
                    <circle cx="50" cy="55" r="4" fill="white" fill-opacity="0.5" transform="rotate(5 50 62.5)"/>
                  </g>
               </svg>
            </div>
            <span class="font-bold text-xl tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors hidden sm:block font-serif">TimeCapsuffle</span>
          </a>
          
          <div class="hidden md:flex gap-1">
            <a routerLink="/home" routerLinkActive="bg-gray-100 text-gray-900" [routerLinkActiveOptions]="{exact: true}" class="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">홈</a>
            <a routerLink="/blog" routerLinkActive="bg-gray-100 text-gray-900" class="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">가이드</a>
            <a routerLink="/home" fragment="archive-section" class="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition cursor-pointer">보관함</a>
          </div>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-5">
           <a routerLink="/contact" class="text-sm font-medium text-gray-500 hover:text-gray-900 transition">문의하기</a>
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
              <a routerLink="/blog" (click)="toggleMenu()" class="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">이용 가이드</a>
              <a routerLink="/about" (click)="toggleMenu()" class="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">소개</a>
              <a routerLink="/home" fragment="archive-section" (click)="toggleMenu()" class="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">보관함</a>
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
