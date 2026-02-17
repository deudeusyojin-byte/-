import { Component, inject, signal, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CreateCapsuleModalComponent } from '../create-capsule-modal/create-capsule-modal.component';
import { CapsuleService, Capsule } from '../../services/capsule.service';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarComponent, CreateCapsuleModalComponent, RouterModule, DatePipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile: Use 100dvh for consistent viewport height -->
    <div class="h-[100dvh] overflow-y-auto bg-gray-50 custom-scrollbar selection:bg-indigo-500 selection:text-white scroll-smooth">
      <app-nav-bar></app-nav-bar>
      
      <!-- Hero Section -->
      <div class="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden border-b border-gray-200 bg-white">
         <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-60"></div>

         <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <!-- Floating Polaroid (CSS Only - Copyright Safe) -->
            <div class="absolute top-12 left-4 md:top-20 md:left-16 w-48 md:w-56 bg-white p-3 shadow-xl transform -rotate-12 border border-gray-200 animate-float-slow transition-all duration-500 hidden md:block">
               <!-- Copyright-free Image Replacement: Highly Reliable Beach Image -->
               <div class="h-32 md:h-40 bg-gray-100 mb-3 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop" class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700 ease-out" alt="Summer Beach Memory">
                  <!-- Subtle filter overlay -->
                  <div class="absolute inset-0 bg-indigo-500/10 mix-blend-overlay"></div>
               </div>
               <div class="font-handwriting text-center text-gray-500 font-bold text-sm">2024 Summer</div>
            </div>

            <!-- Floating Note -->
            <div class="absolute top-24 -right-6 md:top-32 md:right-20 w-40 h-40 md:w-48 md:h-48 bg-yellow-100 shadow-lg transform rotate-6 p-6 flex items-center justify-center text-center font-serif text-gray-700 leading-relaxed animate-float-delayed border border-yellow-200 transition-all duration-500 hidden md:flex break-keep">
               "시간은 흐르지 않고, 우리가 지나가는 것이다."
            </div>

            <!-- Floating Music Player (Bottom Left) -->
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

            <!-- Floating Voice UI (Bottom Right - Position Adjusted Further Down) -->
            <div class="absolute bottom-16 -right-10 md:bottom-6 md:right-20 w-60 md:w-72 bg-white rounded-2xl shadow-xl transform rotate-6 p-4 border border-gray-100 animate-float-delayed transition-all duration-500 hidden md:block">
               <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                  <div class="flex items-center gap-2">
                     <div class="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                     <span class="text-xs font-bold text-gray-400 font-mono">REC 00:04:21</span>
                  </div>
                  <div class="text-xs font-bold text-indigo-500">Voice Note</div>
               </div>
               
               <!-- Waveform Animation -->
               <div class="flex items-center justify-center gap-1 h-12">
                  @for (h of [40, 70, 50, 100, 60, 80, 40, 90, 50]; track $index) {
                     <div 
                        class="w-1.5 bg-indigo-500 rounded-full animate-wave"
                        [style.height.%]="h"
                        [style.animation-delay]="$index * 0.1 + 's'"
                     ></div>
                  }
               </div>
               
               <div class="mt-3 text-center">
                  <p class="text-xs text-gray-400 font-medium">"그때 우리 정말 즐거웠지..."</p>
               </div>
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

            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200 flex-wrap">
               <button (click)="scrollToCapsules()" class="px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3">
                  <span>시작하기</span>
                  <span class="bg-white/20 rounded-full p-1">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </span>
               </button>
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
      <main class="relative z-10 max-w-7xl mx-auto bg-gray-50 border-t border-gray-200">
        <!-- System Capsules (Increased Size) -->
        <div id="capsule-section" class="py-24 px-6 scroll-mt-24 content-visibility-auto">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
               <div>
                  <h2 class="text-3xl font-bold text-gray-900 mb-2">공개 캡슐 둘러보기</h2>
                  <p class="text-gray-500">누구나 자유롭게 참여할 수 있는 열린 공간입니다.</p>
               </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              @for (sys of systemCapsules; track sys.type) {
                <button (click)="openSystemCapsule(sys.type)" class="group relative bg-white h-96 rounded-[2.5rem] p-10 shadow-sm border border-gray-200 hover:shadow-2xl hover:border-indigo-200 hover:-translate-y-2 transition-all duration-300 text-left overflow-hidden flex flex-col justify-between">
                   <!-- Decorative Background Number -->
                   <div class="absolute -right-8 -top-8 text-[12rem] font-black text-gray-50 group-hover:text-indigo-50 transition-colors select-none font-mono leading-none">
                      {{ sys.num }}
                   </div>

                   <div class="relative z-10">
                       <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <span class="w-2 h-2 rounded-full bg-gray-400 group-hover:bg-white"></span>
                          {{ sys.unit }}
                       </div>
                       <h3 class="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                         {{ sys.num }}{{ sys.unitLabel }}
                       </h3>
                       <p class="text-gray-500 text-base mt-4 leading-relaxed break-keep">{{ sys.desc }}</p>
                   </div>
                      
                   <div class="relative z-10 flex items-center text-lg font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">
                      <span>입장하기</span> 
                      <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                   </div>
                </button>
              }
            </div>
        </div>

        <!-- My Capsules / Private Capsules - UNDER CONSTRUCTION -->
        <div id="my-capsules" class="py-12 px-6 scroll-mt-24 content-visibility-auto">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
             <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  공동 캡슐
                  <span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">WIP</span>
                </h2>
                <p class="text-gray-500 text-sm">친구들과 함께 만들고 있는 타임캡슐입니다.</p>
             </div>
          </div>

          <!-- Construction UI -->
          <div class="relative overflow-hidden bg-stone-900 rounded-[2.5rem] h-80 flex flex-col items-center justify-center shadow-2xl group border-4 border-yellow-400 cursor-not-allowed select-none">
             <!-- Caution Tapes Background -->
             <div class="absolute inset-0 bg-stone-900">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-16 bg-yellow-400 rotate-12 flex items-center justify-center border-y-4 border-black opacity-90 shadow-lg z-0">
                    <div class="flex gap-8 font-black text-2xl tracking-widest text-black whitespace-nowrap overflow-hidden">
                       @for (i of [1,2,3,4,5,6]; track i) {
                          <span>KEEP OUT • DEVELOPMENT AREA • KEEP OUT •</span>
                       }
                    </div>
                </div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-16 bg-yellow-400 -rotate-12 flex items-center justify-center border-y-4 border-black opacity-90 shadow-lg z-0">
                    <div class="flex gap-8 font-black text-2xl tracking-widest text-black whitespace-nowrap overflow-hidden">
                       @for (i of [1,2,3,4,5,6]; track i) {
                          <span>UNDER CONSTRUCTION • DO NOT ENTER •</span>
                       }
                    </div>
                </div>
             </div>

             <!-- Warning Icon & Text -->
             <div class="relative z-10 bg-black/80 backdrop-blur-sm p-8 rounded-3xl border border-stone-700 text-center max-w-lg mx-4">
                 <div class="text-6xl mb-4 animate-bounce">🚧</div>
                 <h3 class="text-3xl font-black text-white mb-2 tracking-tight">개발 중입니다</h3>
                 <p class="text-stone-400 text-lg leading-relaxed break-keep">
                    개인 캡슐 생성 기능은 현재 공사 중입니다.<br>
                    위의 <strong class="text-yellow-400">공개 캡슐</strong>을 이용해 주세요!
                 </p>
             </div>
          </div>
        </div>

        <!-- Archive Section (Memories) -->
        <div id="archive-section" class="py-12 px-6 mb-12 scroll-mt-24 content-visibility-auto">
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
                       <div class="h-40 bg-gray-200 relative p-6 flex flex-col justify-center text-center">
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
        
        <!-- NEW: Introduction / Brand Story Section (Text Rich) -->
        <section class="py-24 bg-white border-y border-gray-200 px-6">
          <div class="max-w-4xl mx-auto">
            <span class="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-4 block">Brand Story</span>
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-10 font-serif leading-tight">
              기억은 흐려지지만,<br>
              <span class="text-gray-400">기록은 영원합니다.</span>
            </h2>
            <div class="prose prose-lg text-gray-600 leading-relaxed space-y-8 font-light">
              <p>
                우리는 너무나 빠른 속도의 시대를 살아가고 있습니다. 어제 먹은 점심 메뉴가 기억나지 않고, 
                일주일 전 친구와 나누었던 깊은 대화도 카카오톡 스크롤 위로 밀려나 금세 잊혀지곤 합니다. 
                <strong>Time Capsuffle</strong>은 이러한 현대의 '디지털 휘발성'에 대한 깊은 고민에서 시작되었습니다.
              </p>
              <div class="border-l-4 border-indigo-200 pl-6 my-8 italic text-gray-500">
                 "왜 우리의 소중한 추억은 그저 스쳐 지나가는 데이터 조각이 되어야 할까요?"
              </div>
              <p>
                우리는 기술이 인간의 기억을 대체하는 것이 아니라, 더욱 따뜻하고 감각적으로 보존하는 도구가 되어야 한다고 믿습니다. 
                친구들과 함께 캔버스를 꾸미며 나누는 웃음, 사진 위에 덧그린 서툰 낙서, 그리고 그 순간의 공기까지. 
                우리는 단순한 파일이 아닌 <strong>'맥락(Context)'</strong>을 저장합니다.
              </p>
              <p>
                타임캡슐을 봉인하고 기다리는 시간 동안, 우리는 설렘을 느낍니다. 
                그리고 먼 훗날 캡슐을 열었을 때, 과거의 나 자신이 보낸 따뜻한 응원을 마주하게 됩니다. 
                이것이 우리가 정의하는 <strong>'디지털 슬로우 라이프'</strong>이며, Time Capsuffle이 존재하는 이유입니다.
              </p>
            </div>
            
            <div class="mt-12 flex gap-4">
               <a routerLink="/about" class="text-indigo-600 font-bold hover:underline">서비스 소개 더보기 &rarr;</a>
            </div>
          </div>
        </section>

        <!-- NEW: Magazine / Featured Articles List -->
        <div id="stories-section" class="py-24 max-w-4xl mx-auto px-6">
            <div class="mb-12 border-b border-gray-200 pb-6 flex items-end justify-between">
               <div>
                  <h2 class="text-3xl font-bold text-gray-900 mb-2 font-serif">Time Capsuffle Magazine</h2>
                  <p class="text-gray-500">디지털 아카이빙과 추억에 관한 에세이</p>
               </div>
               <a routerLink="/blog" class="hidden md:block text-sm font-bold text-gray-400 hover:text-indigo-600 transition">전체보기</a>
            </div>

            <div class="flex flex-col gap-16">
               @for (post of blogPosts().slice(0, 5); track post.id) {
                  <article class="flex flex-col md:flex-row gap-8 items-start group cursor-pointer" [routerLink]="['/blog', post.id]">
                     <div class="w-full md:w-64 h-48 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 relative shadow-md">
                        <img [src]="post.imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" [alt]="post.title">
                        <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition"></div>
                     </div>
                     <div class="flex-1">
                        <div class="flex items-center gap-3 mb-3">
                           <span class="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md uppercase tracking-wider">{{ post.category }}</span>
                           <span class="text-xs text-gray-400">{{ post.date }}</span>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                           {{ post.title }}
                        </h3>
                        <p class="text-gray-600 leading-relaxed mb-4 line-clamp-3 md:line-clamp-2">
                           {{ post.excerpt }}
                        </p>
                        <div class="text-indigo-600 font-bold text-sm group-hover:underline flex items-center gap-1">
                           Read Article 
                           <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </div>
                     </div>
                  </article>
               }
            </div>
            
            <div class="mt-16 text-center">
               <a routerLink="/blog" class="inline-block px-8 py-4 border border-gray-300 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition hover:border-gray-400">
                  매거진 전체보기
               </a>
            </div>
        </div>

      </main>

      <!-- Footer Section -->
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
                  <li><a routerLink="/about" class="hover:text-white transition">서비스 소개 (About Us)</a></li>
                  <li><a routerLink="/blog" class="hover:text-white transition">이용 가이드 (Blog)</a></li>
                  <li><a routerLink="/home" class="hover:text-white transition">실시간 캔버스</a></li>
               </ul>
            </div>
            <div>
               <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Legal & Support</h4>
               <ul class="space-y-3">
                  <li><a routerLink="/terms" class="hover:text-white transition">이용약관 (Terms)</a></li>
                  <li><a routerLink="/privacy" class="hover:text-white transition">개인정보처리방침 (Privacy)</a></li>
                  <li><a routerLink="/contact" class="hover:text-white transition">문의하기 (Contact)</a></li>
               </ul>
            </div>
         </div>
         <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600">
            <p>© 2024 Time Capsuffle Project. All rights reserved.</p>
            <div class="mt-2 md:mt-0 flex gap-4 items-center">
               <span>Seoul, Republic of Korea</span>
               <span class="w-1 h-1 bg-stone-700 rounded-full"></span>
               <a href="mailto:DEUSUNGJIN@GMAIL.COM" class="hover:text-white transition">DEUSUNGJIN@GMAIL.COM</a>
            </div>
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
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
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
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Voice Wave Animation */
    .animate-wave { animation: wave 1.2s ease-in-out infinite; }
    @keyframes wave {
      0%, 100% { height: 30%; opacity: 0.6; }
      50% { height: 100%; opacity: 1; }
    }
  `]
})
export class HomeComponent implements AfterViewInit {
  capsuleService: CapsuleService = inject(CapsuleService);
  authService: AuthService = inject(AuthService);
  blogService: BlogService = inject(BlogService);
  router: Router = inject(Router);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  
  showModal = signal(false);
  
  capsules = this.capsuleService.capsules;
  archives = this.capsuleService.archives;
  blogPosts = this.blogService.posts;

  systemCapsules = [
    { type: '1d', num: '24', unit: 'HOURS', unitLabel: '시간', desc: '하루 동안만 유지되는 찰나의 기록' },
    { type: '1w', num: '07', unit: 'DAYS', unitLabel: '일', desc: '일주일 간의 짧은 여정 공유' },
    { type: '1m', num: '30', unit: 'DAYS', unitLabel: '일', desc: '한 달 동안의 추억을 모아보세요' },
    { type: '1y', num: '365', unit: 'DAYS', unitLabel: '일', desc: '1년 뒤의 나에게 보내는 편지' },
  ];

  ngAfterViewInit() {
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
    alert("개인 캡슐 생성은 현재 개발 중입니다. 공개 캡슐을 이용해주세요!");
  }

  scrollToCapsules() {
    document.getElementById('capsule-section')?.scrollIntoView({ behavior: 'smooth' });
  }
}