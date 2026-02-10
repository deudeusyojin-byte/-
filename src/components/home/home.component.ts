import { Component, inject, signal, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CreateCapsuleModalComponent } from '../create-capsule-modal/create-capsule-modal.component';
import { CapsuleService, Capsule } from '../../services/capsule.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarComponent, CreateCapsuleModalComponent, RouterModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile: Use 100dvh for consistent viewport height -->
    <div class="h-[100dvh] overflow-y-auto bg-gray-50 custom-scrollbar selection:bg-indigo-500 selection:text-white scroll-smooth">
      <app-nav-bar></app-nav-bar>
      
      <!-- Hero Section (Restored to Original Rich Design) -->
      <div class="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden border-b border-gray-200 bg-white">
         <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-60"></div>

         <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <!-- Floating Polaroid -->
            <div class="absolute top-12 left-4 md:top-20 md:left-16 w-48 md:w-56 bg-white p-3 shadow-xl transform -rotate-12 border border-gray-200 animate-float-slow transition-all duration-500 hidden md:block">
               <div class="h-32 md:h-40 bg-gray-200 mb-3 overflow-hidden">
                  <img src="https://picsum.photos/id/1015/300/300" class="w-full h-full object-cover grayscale opacity-80" loading="lazy">
               </div>
               <div class="font-handwriting text-center text-gray-500 font-bold text-sm">2024 Summer</div>
            </div>

            <!-- Floating Note -->
            <div class="absolute top-24 -right-6 md:top-32 md:right-20 w-40 h-40 md:w-48 md:h-48 bg-yellow-100 shadow-lg transform rotate-6 p-6 flex items-center justify-center text-center font-serif text-gray-700 leading-relaxed animate-float-delayed border border-yellow-200 transition-all duration-500 hidden md:flex break-keep">
               "시간은 흐르지 않고, 우리가 지나가는 것이다."
            </div>

            <!-- Floating Music Player (Restored) -->
            <div class="absolute bottom-10 -left-10 md:bottom-20 md:left-10 w-56 md:w-64 bg-black rounded-lg shadow-2xl transform rotate-3 p-1 border-2 border-gray-800 animate-float transition-all duration-500 opacity-90 hidden md:block">
               <div class="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <div class="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                     <div class="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                  <div class="absolute bottom-2 left-2 right-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                     <div class="w-1/3 h-full bg-red-500"></div>
                  </div>
               </div>
            </div>

            <!-- Floating Squiggle (Restored) -->
            <div class="absolute bottom-16 -right-5 md:bottom-24 md:right-24 opacity-40 transform -rotate-12 transition-all duration-500 hidden md:block">
               <svg width="200" height="100" viewBox="0 0 200 100" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round">
                  <path d="M10,50 Q50,10 90,50 T180,50" />
                  <path d="M20,60 Q60,90 100,40" stroke="#ec4899" />
               </svg>
            </div>
            
            <!-- Collaborative Cursors (Visual) -->
            <div class="absolute top-[35%] left-[20%] animate-pulse hidden md:block">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#EF4444" stroke="white" stroke-width="2"/></svg>
               <span class="ml-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded shadow-sm">Jimin</span>
            </div>
            <div class="absolute bottom-[40%] right-[15%] animate-pulse delay-700 hidden md:block">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#3B82F6" stroke="white" stroke-width="2"/></svg>
               <span class="ml-4 bg-blue-500 text-white text-xs px-2 py-0.5 rounded shadow-sm">Min-su</span>
            </div>
         </div>

         <div class="relative z-10 text-center px-4 max-w-4xl mx-auto mt-0 md:mt-10">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 mb-6 animate-fade-in backdrop-blur-sm bg-opacity-80">
               <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
               <span class="text-xs font-bold text-gray-600 tracking-wider uppercase">Real-time Collab Canvas</span>
            </div>

            <h1 class="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8 animate-fade-in drop-shadow-sm break-keep">
               우리만의 시간을<br>
               <span class="relative inline-block text-indigo-600">
                  캔버스
                  <svg class="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" /></svg>
               </span>에 담다
            </h1>
            
            <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-in delay-100 drop-shadow-sm bg-white/30 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-xl p-2 md:p-0 break-keep">
               친구들과 함께 실시간으로 추억을 꾸며보세요.<br class="hidden md:block">
               사진, 동영상, 낙서가 모여 하나의 타임캡슐이 됩니다.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
               <button (click)="scrollToCapsules()" class="px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                  <span>시작하기</span>
                  <span class="bg-white/20 rounded-full p-1">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
               </button>
               
               @if (authService.currentUser()) {
                 <button (click)="handleCreateCapsule()" class="px-10 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm backdrop-blur-sm bg-opacity-80">
                    새 캡슐 만들기
                 </button>
               } @else {
                 <button (click)="router.navigate(['/login'])" class="px-10 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm backdrop-blur-sm bg-opacity-80">
                    개인용 캡슐 만들기
                 </button>
               }
            </div>
         </div>
         
         <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
      </div>

      <!-- Features Section -->
      <section class="py-16 bg-white border-b border-gray-100">
         <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
               <div class="p-4 group hover:bg-gray-50 rounded-xl transition-colors">
                  <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">🚀</div>
                  <div class="font-bold text-gray-900 mb-1">간편한 접속</div>
                  <div class="text-xs text-gray-500 break-keep">별도 앱 설치 없이 웹에서 바로</div>
               </div>
               <div class="p-4 group hover:bg-gray-50 rounded-xl transition-colors">
                  <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                  <div class="font-bold text-gray-900 mb-1">실시간 캔버스</div>
                  <div class="text-xs text-gray-500 break-keep">낙서와 사진을 자유롭게 배치</div>
               </div>
               <div class="p-4 group hover:bg-gray-50 rounded-xl transition-colors">
                  <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">💸</div>
                  <div class="font-bold text-gray-900 mb-1">완전 무료</div>
                  <div class="text-xs text-gray-500 break-keep">복잡한 결제/구독 없음</div>
               </div>
               <div class="p-4 group hover:bg-gray-50 rounded-xl transition-colors">
                  <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">🔒</div>
                  <div class="font-bold text-gray-900 mb-1">비밀번호 잠금</div>
                  <div class="text-xs text-gray-500 break-keep">우리끼리만 아는 암호 설정</div>
               </div>
            </div>
         </div>
      </section>

      <!-- Main Application Area -->
      <main class="relative z-10 max-w-7xl mx-auto px-6 py-24 bg-gray-50 border-t border-gray-200">
        <!-- System Capsules -->
        <div id="capsule-section" class="mb-32 scroll-mt-24 content-visibility-auto">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
               <div>
                  <h2 class="text-3xl font-bold text-gray-900 mb-2">공개 캡슐 둘러보기</h2>
                  <p class="text-gray-500">누구나 자유롭게 참여할 수 있는 열린 공간입니다.</p>
               </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (sys of systemCapsules; track sys.type) {
                <button (click)="openSystemCapsule(sys.type)" class="group relative bg-white h-72 rounded-3xl p-8 shadow-sm border border-gray-200 hover:shadow-2xl hover:border-indigo-200 hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden">
                   <!-- Decorative Background Number -->
                   <div class="absolute -right-6 -top-6 text-9xl font-black text-gray-50 group-hover:text-indigo-50 transition-colors select-none font-mono">
                      {{ sys.num }}
                   </div>

                   <div class="relative z-10 h-full flex flex-col justify-between">
                      <div>
                         <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-full mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-white"></span>
                            {{ sys.unit }}
                         </div>
                         <h3 class="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                           {{ sys.num }}{{ sys.unitLabel }}
                         </h3>
                         <p class="text-gray-500 text-sm mt-3 leading-relaxed break-keep">{{ sys.desc }}</p>
                      </div>
                      
                      <div class="flex items-center text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors mt-auto">
                         <span>입장하기</span> 
                         <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </div>
                   </div>
                </button>
              }
            </div>
        </div>

        <!-- My Capsules (Active) -->
        <div id="my-capsules" class="mb-32 scroll-mt-24 content-visibility-auto">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
             <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  공동 캡슐
                  <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">LIVE</span>
                </h2>
                <p class="text-gray-500 text-sm">친구들과 함께 만들고 있는 타임캡슐입니다.</p>
             </div>
             @if (authService.currentUser() || capsules().length > 0) {
                <button (click)="handleCreateCapsule()" class="hidden md:flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                   <span>새 캡슐 만들기</span>
                </button>
             }
          </div>

          <!-- Logic: Show capsules if they exist (even if not logged in). Only show login banner if NO capsules AND not logged in. -->
          @if (capsules().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              @for (capsule of capsules(); track capsule.id) {
                <a [routerLink]="['/capsule', capsule.id]" class="block bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 group transform hover:-translate-y-1">
                   <div class="h-40 bg-slate-50 relative p-6 flex flex-col justify-between group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-white transition-colors">
                      <div class="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
                      
                      <div class="relative z-10 flex justify-between items-start">
                         <span class="bg-white/80 backdrop-blur border border-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm">
                            ⏳ {{ getDurationLabel(capsule.duration) }}
                         </span>
                         @if (capsule.password) {
                            <span class="bg-stone-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                               🔒 Private
                            </span>
                         } @else {
                            <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                               🔓 Public
                            </span>
                         }
                      </div>
                      <h3 class="relative z-10 text-xl font-bold text-gray-900 truncate mt-2 group-hover:text-indigo-700 transition-colors">{{ capsule.name }}</h3>
                   </div>
                   
                   <div class="p-6">
                      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                         <span class="font-mono text-xs">Created: {{ capsule.createdDate | date:'yyyy.MM.dd' }}</span>
                         <div class="flex -space-x-2">
                            <div class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                            <div class="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                            <div class="w-6 h-6 rounded-full bg-indigo-400 border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">+</div>
                         </div>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                         <div class="bg-indigo-500 h-full rounded-full w-2/3 animate-pulse"></div>
                      </div>
                      <div class="mt-2 text-right text-xs text-indigo-600 font-bold">진행 중...</div>
                   </div>
                </a>
              }
            </div>
            
            @if (authService.currentUser() || capsules().length > 0) {
               <button (click)="handleCreateCapsule()" class="md:hidden w-full mt-6 py-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors border border-indigo-200 border-dashed">
                  + 새 캡슐 만들기
               </button>
            }
          } @else if (!authService.currentUser()) {
            <!-- Login Prompt Banner (Only when no data + no login) -->
            <div class="bg-stone-900 rounded-[2rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
               <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-30"></div>
               <div class="absolute bottom-0 left-0 w-64 h-64 bg-pink-600 rounded-full blur-[100px] opacity-20"></div>

               <div class="relative z-10 max-w-2xl mx-auto">
                 <h3 class="text-3xl md:text-4xl font-bold mb-6 break-keep">아직 캡슐이 없습니다.</h3>
                 <p class="text-stone-300 mb-10 text-lg leading-relaxed break-keep">
                   나만의 비밀 캡슐을 만들거나 친구들을 초대하세요.<br>
                   계정을 생성하면 모든 기록이 안전하게 암호화되어 보관됩니다.
                 </p>
                 <button (click)="router.navigate(['/login'])" class="px-10 py-4 bg-white text-stone-900 rounded-full font-bold text-lg hover:bg-stone-200 transition shadow-xl transform hover:-translate-y-1">
                   개인용 캡슐 만들기 (시작하기)
                 </button>
               </div>
            </div>
          } @else {
             <!-- Logged in but no capsules -->
             <div class="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-20 text-center hover:bg-gray-50 transition-all cursor-pointer group" (click)="showModal.set(true)">
               <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform group-hover:bg-indigo-100">
                  <svg class="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
               </div>
               <h3 class="text-2xl font-bold text-gray-900 mb-2 break-keep">첫 번째 캡슐을 만들어보세요</h3>
               <p class="text-gray-500 max-w-md mx-auto break-keep">특별한 날, 소중한 사람들과 함께할 공간이 필요하신가요?<br>클릭하여 시작하세요.</p>
            </div>
          }
        </div>

        <!-- Archive Section (Memories) -->
        <div id="archive-section" class="mb-24 scroll-mt-24 content-visibility-auto">
           <div class="mb-8">
               <h2 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  보관함
                  <span class="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">ARCHIVED</span>
               </h2>
               <p class="text-gray-500 text-sm">기간이 만료되어 봉인된 추억들입니다.</p>
           </div>

           @if (archives().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                 @for (arc of archives(); track arc.id) {
                    <a [routerLink]="['/capsule', arc.id]" class="block bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all group opacity-80 hover:opacity-100">
                       <div class="h-28 bg-gray-200 relative p-6 flex flex-col justify-center text-center">
                          <div class="absolute inset-0 bg-[linear-gradient(45deg,#00000005_25%,transparent_25%,transparent_50%,#00000005_50%,#00000005_75%,transparent_75%,transparent)] [background-size:20px_20px]"></div>
                          <div class="absolute top-3 right-3 text-2xl grayscale">🔒</div>
                          <h3 class="relative z-10 text-xl font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{{ arc.name }}</h3>
                       </div>
                       <div class="p-5">
                          <div class="flex items-center justify-between text-xs text-gray-400">
                             <span class="font-mono">Sealed: {{ arc.archivedDate | date:'yyyy.MM.dd' }}</span>
                             <span class="text-white font-bold bg-gray-400 px-2 py-0.5 rounded-full">열람 가능</span>
                          </div>
                       </div>
                    </a>
                 }
              </div>
           } @else {
              <div class="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
                 <div class="text-4xl mb-4 grayscale opacity-30">📦</div>
                 <h3 class="text-lg font-bold text-gray-400 mb-2">아직 보관된 추억이 없습니다</h3>
                 <p class="text-gray-400 text-sm break-keep">진행 중인 캡슐의 기간이 종료되면 이곳으로 이동됩니다.</p>
              </div>
           }
        </div>
        
        <!-- FAQ Section (AdSense Content Value) -->
        <section class="mb-24 pt-16 border-t border-gray-100">
           <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900">자주 묻는 질문 (FAQ)</h2>
              <p class="text-gray-500 mt-2">서비스 이용에 대해 궁금한 점을 확인하세요.</p>
           </div>
           
           <div class="max-w-3xl mx-auto space-y-6">
              <div class="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                 <h3 class="font-bold text-gray-900 text-lg mb-2">Q. 캡슐은 언제까지 보관되나요?</h3>
                 <p class="text-gray-600 text-sm leading-relaxed break-keep">
                    Time Capsuffle의 모든 캡슐은 기간이 설정되어 있습니다. 24시간, 1주일, 1달, 1년 중 선택할 수 있으며,
                    해당 기간이 지나면 '보관함(Archive)'으로 이동되어 더 이상 수정할 수 없고 열람만 가능한 영구 보존 상태가 됩니다.
                 </p>
              </div>
              
              <div class="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                 <h3 class="font-bold text-gray-900 text-lg mb-2">Q. 비밀번호를 잊어버렸어요.</h3>
                 <p class="text-gray-600 text-sm leading-relaxed break-keep">
                    프라이빗 캡슐의 보안을 위해 비밀번호는 암호화되어 저장되므로, 운영자도 알 수 없습니다.
                    캡슐을 생성한 '주인장(Creator)'은 비밀번호 없이 입장할 수 있으니, 생성자에게 문의하여 캡슐 정보를 확인하시거나
                    새로운 캡슐을 생성하시기 바랍니다.
                 </p>
              </div>

              <div class="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                 <h3 class="font-bold text-gray-900 text-lg mb-2">Q. 친구들을 어떻게 초대하나요?</h3>
                 <p class="text-gray-600 text-sm leading-relaxed break-keep">
                    캡슐 생성 후 브라우저의 주소창(URL)을 복사하여 친구들에게 공유하세요.
                    프라이빗 캡슐의 경우 설정한 비밀번호도 함께 알려주셔야 친구들이 입장할 수 있습니다.
                    별도의 앱 설치 없이 웹에서 바로 참여 가능합니다.
                 </p>
              </div>

               <div class="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                 <h3 class="font-bold text-gray-900 text-lg mb-2">Q. 사진이나 동영상의 용량 제한이 있나요?</h3>
                 <p class="text-gray-600 text-sm leading-relaxed break-keep">
                    쾌적한 실시간 협업 환경을 위해 각 미디어 파일은 최적화되어 업로드됩니다.
                    대용량 동영상의 경우 자동으로 압축될 수 있으며, 너무 큰 파일은 업로드가 제한될 수 있습니다.
                    텍스트와 드로잉은 무제한으로 사용 가능합니다.
                 </p>
              </div>
           </div>
        </section>
      </main>

      <!-- Footer Section (AdSense Value) -->
      <footer class="bg-stone-900 text-stone-400 py-20 border-t border-stone-800">
         <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
            <div class="col-span-1 md:col-span-2">
               <div class="flex items-center gap-3 mb-6">
                  <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-stone-900 font-bold font-mono text-lg">T</div>
                  <span class="text-white text-xl font-bold tracking-tight">TimeCapsuffle</span>
               </div>
               <p class="leading-relaxed mb-6 max-w-sm text-stone-500 break-keep">
                  우리는 기술을 통해 사라져가는 아날로그 감성을 복원합니다.<br>
                  친구들과 함께 잊지 못할 디지털 추억을 만들어보세요.
               </p>
               <div class="flex gap-4">
                  <a href="#" class="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition" (click)="$event.preventDefault()">🐦</a>
                  <a href="#" class="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition" (click)="$event.preventDefault()">📸</a>
                  <a href="#" class="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition" (click)="$event.preventDefault()">💬</a>
               </div>
            </div>
            <div>
               <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Platform</h4>
               <ul class="space-y-3">
                  <li><a routerLink="/home" fragment="capsule-section" class="hover:text-white transition">공개 캡슐</a></li>
                  <li><a routerLink="/home" class="hover:text-white transition">실시간 캔버스</a></li>
                  <li><a routerLink="/home" class="hover:text-white transition">AI 이미지 생성</a></li>
                  <li><a routerLink="/home" class="hover:text-white transition">업데이트 노트</a></li>
               </ul>
            </div>
            <div>
               <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Legal & Support</h4>
               <ul class="space-y-3">
                  <li><a routerLink="/terms" class="hover:text-white transition">이용약관</a></li>
                  <li><a routerLink="/privacy" class="hover:text-white transition">개인정보처리방침</a></li>
               </ul>
            </div>
         </div>
         <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600">
            <p>© 2024 Time Capsuffle Project. All rights reserved.</p>
            <p class="mt-2 md:mt-0">Designed for Memories.</p>
         </div>
      </footer>

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
    .animate-scroll-down { animation: scrollDown 1.5s infinite; }
    .break-keep { word-break: keep-all; }
    
    @keyframes float {
      0% { transform: translateY(0px) rotate(var(--tw-rotate)); }
      50% { transform: translateY(-10px) rotate(var(--tw-rotate)); }
      100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
    }
    
    @keyframes scrollDown {
       0% { transform: translateY(0); opacity: 1; }
       100% { transform: translateY(12px); opacity: 0; }
    }
  `]
})
export class HomeComponent implements AfterViewInit {
  capsuleService = inject(CapsuleService);
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  showModal = signal(false);

  capsules = this.capsuleService.capsules;
  archives = this.capsuleService.archives;

  systemCapsules = [
    { type: '1d', num: '24', unit: 'HOURS', unitLabel: '시간', desc: '하루 동안만 유지되는 찰나의 기록' },
    { type: '1w', num: '07', unit: 'DAYS', unitLabel: '일', desc: '일주일 간의 짧은 여정 공유' },
    { type: '1m', num: '30', unit: 'DAYS', unitLabel: '일', desc: '한 달 동안의 추억을 모아보세요' },
    { type: '1y', num: '365', unit: 'DAYS', unitLabel: '일', desc: '1년 뒤의 나에게 보내는 편지' },
  ];

  ngAfterViewInit() {
    // Handle scrolling if fragment is present
    this.activatedRoute.fragment.subscribe(fragment => {
       if (fragment) {
          setTimeout(() => {
             const element = document.getElementById(fragment);
             if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
             }
          }, 100);
       }
    });
  }

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