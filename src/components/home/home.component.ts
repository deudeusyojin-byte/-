import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CreateCapsuleModalComponent } from '../create-capsule-modal/create-capsule-modal.component';
import { CapsuleService, Capsule } from '../../services/capsule.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarComponent, CreateCapsuleModalComponent, RouterModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-screen overflow-y-auto bg-gray-50 custom-scrollbar selection:bg-indigo-500 selection:text-white">
      <app-nav-bar></app-nav-bar>
      
      <!-- Hero Section: Simulated Canvas Background -->
      <div class="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden border-b border-gray-200">
         
         <!-- 1. The Canvas Grid Pattern (Background) -->
         <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-60"></div>

         <!-- 2. Simulated Canvas Items (Decorations) - Moved to edges -->
         <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <!-- Item 1: Polaroid (Top Left Corner) -->
            <div class="absolute top-12 left-4 md:top-20 md:left-16 w-48 md:w-56 bg-white p-3 shadow-xl transform -rotate-12 border border-gray-200 animate-float-slow transition-all duration-500">
               <div class="h-32 md:h-40 bg-gray-200 mb-3 overflow-hidden">
                  <img src="https://picsum.photos/id/1015/300/300" class="w-full h-full object-cover grayscale opacity-80">
               </div>
               <div class="font-handwriting text-center text-gray-500 font-bold text-sm">2024 Summer</div>
            </div>

            <!-- Item 2: Sticky Note (Top Right Corner) -->
            <div class="absolute top-24 -right-6 md:top-32 md:right-20 w-40 h-40 md:w-48 md:h-48 bg-yellow-100 shadow-lg transform rotate-6 p-6 flex items-center justify-center text-center font-serif text-gray-700 leading-relaxed animate-float-delayed border border-yellow-200 transition-all duration-500">
               "시간은 흐르지 않고, 우리가 지나가는 것이다."
            </div>

            <!-- Item 3: Video Placeholder (Bottom Left Corner - Adjusted to not overlap text) -->
            <div class="absolute bottom-10 -left-10 md:bottom-20 md:left-10 w-56 md:w-64 bg-black rounded-lg shadow-2xl transform rotate-3 p-1 border-2 border-gray-800 animate-float transition-all duration-500 opacity-90">
               <div class="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                     <div class="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                  <!-- Fake progress bar -->
                  <div class="absolute bottom-2 left-2 right-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                     <div class="w-1/3 h-full bg-red-500"></div>
                  </div>
               </div>
            </div>

             <!-- Item 4: Scribble (Bottom Right Corner) -->
            <div class="absolute bottom-16 -right-5 md:bottom-24 md:right-24 opacity-40 transform -rotate-12 transition-all duration-500">
               <svg width="200" height="100" viewBox="0 0 200 100" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round">
                  <path d="M10,50 Q50,10 90,50 T180,50" />
                  <path d="M20,60 Q60,90 100,40" stroke="#ec4899" />
               </svg>
            </div>
            
            <!-- Simulated Cursors (Moved slightly to interact with items) -->
            <div class="absolute top-[35%] left-[20%] animate-pulse hidden md:block">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#EF4444" stroke="white" stroke-width="2"/></svg>
               <span class="ml-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded shadow-sm">Jimin</span>
            </div>
            <div class="absolute bottom-[40%] right-[15%] animate-pulse delay-700 hidden md:block">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#3B82F6" stroke="white" stroke-width="2"/></svg>
               <span class="ml-4 bg-blue-500 text-white text-xs px-2 py-0.5 rounded shadow-sm">Min-su</span>
            </div>
         </div>

         <!-- Hero Content -->
         <div class="relative z-10 text-center px-4 max-w-4xl mx-auto mt-0 md:mt-10">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 mb-6 animate-fade-in backdrop-blur-sm bg-opacity-80">
               <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
               <span class="text-xs font-bold text-gray-600 tracking-wider uppercase">Real-time Collab Canvas</span>
            </div>

            <h1 class="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8 animate-fade-in drop-shadow-sm">
               우리만의 시간을<br>
               <span class="relative inline-block text-indigo-600">
                  캔버스
                  <svg class="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" /></svg>
               </span>에 담다
            </h1>
            
            <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-in delay-100 drop-shadow-sm bg-white/30 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-xl p-2 md:p-0">
               친구들과 함께 실시간으로 추억을 꾸며보세요.<br class="hidden md:block">
               사진, 동영상, 낙서가 모여 하나의 타임캡슐이 됩니다.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
               <!-- 'Start' Button now scrolls (Browse role) -->
               <button (click)="scrollToCapsules()" class="px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                  <span>시작하기</span>
                  <span class="bg-white/20 rounded-full p-1">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
               </button>
               
               <!-- 'Browse' Button renamed to 'Login' (or Create Capsule if logged in) -->
               @if (authService.currentUser()) {
                 <button (click)="handleCreateCapsule()" class="px-10 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm backdrop-blur-sm bg-opacity-80">
                    새 캡슐 만들기
                 </button>
               } @else {
                 <button (click)="router.navigate(['/login'])" class="px-10 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm backdrop-blur-sm bg-opacity-80">
                    로그인
                 </button>
               }
            </div>
         </div>
         
         <!-- Fade to content -->
         <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
      </div>

      <main class="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <!-- System Capsules -->
        <div id="capsule-section" class="mb-24">
            <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
               <span class="w-8 h-1 bg-indigo-600 rounded-full"></span>
               공개 캡슐
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (sys of systemCapsules; track sys.type) {
                <button (click)="openSystemCapsule(sys.type)" class="group relative bg-white h-64 rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
                   <!-- Background Number -->
                   <div class="absolute -right-2 -top-2 text-8xl font-black text-gray-100 group-hover:text-indigo-50 transition-colors select-none font-mono">
                      {{ sys.num }}
                   </div>

                   <div class="relative z-10 h-full flex flex-col justify-between">
                      <div>
                         <div class="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded mb-3 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                            {{ sys.unit }}
                         </div>
                         <h3 class="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                           {{ sys.num }}{{ sys.unitLabel }}
                         </h3>
                         <p class="text-gray-500 text-sm mt-2 leading-snug">{{ sys.desc }}</p>
                      </div>
                      
                      <div class="flex items-center text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">
                         입장하기 <span class="ml-1">→</span>
                      </div>
                   </div>
                </button>
              }
            </div>
        </div>

        <!-- My Capsules -->
        <div>
          <div class="flex items-center justify-between mb-8">
             <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
               <span class="w-8 h-1 bg-green-500 rounded-full"></span>
               나의 보관함
             </h2>
             @if (authService.currentUser() && capsules().length > 0) {
                <button (click)="showModal.set(true)" class="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                   <span>+ 새 캡슐 추가</span>
                </button>
             }
          </div>

          @if (authService.currentUser()) {
             @if (capsules().length > 0) {
               <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                 @for (capsule of capsules(); track capsule.id) {
                   <a [routerLink]="['/capsule', capsule.id]" class="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all group">
                      <div class="h-32 bg-gray-50 relative p-5 flex flex-col justify-between group-hover:bg-indigo-50 transition-colors">
                         <!-- Grid Pattern in Card -->
                         <div class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                         
                         <div class="relative z-10 flex justify-between items-start">
                            <span class="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 shadow-sm">
                               {{ getDurationLabel(capsule.duration) }}
                            </span>
                         </div>
                         <h3 class="relative z-10 text-lg font-bold text-gray-900 truncate">{{ capsule.name }}</h3>
                      </div>
                      
                      <div class="p-5">
                         <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span class="font-mono">{{ capsule.createdDate | date:'yyyy.MM.dd' }}</span>
                            <span class="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">진행 중</span>
                         </div>
                         <div class="w-full bg-gray-100 rounded-full h-1">
                            <div class="bg-indigo-500 h-1 rounded-full w-1/2"></div>
                         </div>
                      </div>
                   </a>
                 }
               </div>
             } @else {
               <div class="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center hover:bg-gray-50 transition-colors cursor-pointer group" (click)="showModal.set(true)">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-1">첫 번째 기록 시작하기</h3>
                  <p class="text-gray-500">이곳을 클릭하여 캔버스를 만드세요.</p>
               </div>
             }
          } @else {
            <div class="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl">
               <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div class="relative z-10">
                 <h3 class="text-2xl font-bold mb-4">로그인하고 시작하기</h3>
                 <p class="text-indigo-200 mb-8 max-w-md mx-auto">
                   나만의 캡슐을 만들고, 친구들을 초대하세요.<br>
                   모든 기록은 안전하게 보관됩니다.
                 </p>
                 <button (click)="router.navigate(['/login'])" class="px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-indigo-50 transition shadow-lg">
                   계정 만들기
                 </button>
               </div>
            </div>
          }
        </div>
      </main>

      @if (showModal()) {
        <app-create-capsule-modal (close)="showModal.set(false)"></app-create-capsule-modal>
      }
    </div>
  `,
  styles: [`
    .font-handwriting { font-family: cursive; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-slow { animation: float 8s ease-in-out infinite; }
    .animate-float-delayed { animation: float 7s ease-in-out infinite 1s; }
    
    @keyframes float {
      0% { transform: translateY(0px) rotate(var(--tw-rotate)); }
      50% { transform: translateY(-10px) rotate(var(--tw-rotate)); }
      100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
    }
  `]
})
export class HomeComponent {
  capsuleService = inject(CapsuleService);
  authService = inject(AuthService);
  router = inject(Router);
  showModal = signal(false);

  capsules = this.capsuleService.capsules;

  systemCapsules = [
    { type: '1d', num: '24', unit: 'HOURS', unitLabel: '시간', desc: '하루 동안만 유지되는 기록' },
    { type: '1w', num: '07', unit: 'DAYS', unitLabel: '일', desc: '일주일 간의 짧은 여정' },
    { type: '1m', num: '30', unit: 'DAYS', unitLabel: '일', desc: '한 달 동안의 추억 보관' },
    { type: '1y', num: '365', unit: 'DAYS', unitLabel: '일', desc: '1년 뒤의 나에게 보내는 편지' },
  ];

  getDurationLabel(value: string): string {
    const map: Record<string, string> = {
      '1d': '24시간', '1w': '7일', '1m': '30일', '1y': '365일'
    };
    return map[value] || value;
  }

  openSystemCapsule(type: string) {
    const capsule = this.capsuleService.getSystemCapsule(type as any);
    this.router.navigate(['/capsule', capsule.id]);
  }

  handleCreateCapsule() {
    if (this.authService.currentUser()) {
      this.showModal.set(true);
    } else {
      if(confirm('개인 캡슐을 만드려면 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?')) {
        this.router.navigate(['/login']);
      }
    }
  }

  scrollToCapsules() {
    document.getElementById('capsule-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}