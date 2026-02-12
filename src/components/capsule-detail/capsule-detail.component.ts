import { Component, inject, signal, effect, ElementRef, ViewChild, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CapsuleService, Capsule, CapsuleItem } from '../../services/capsule.service';
import { AuthService } from '../../services/auth.service';
import { CollabService } from '../../services/collab.service';
import { GeminiService } from '../../services/gemini.service';
import { GifService } from '../../services/gif.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

declare var html2canvas: any; // Declare for TS

@Component({
  selector: 'app-capsule-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile: Use 100dvh to fix address bar resizing issues. touch-action: none prevents browser gestures. -->
    <div class="h-[100dvh] w-screen flex flex-col bg-gray-100 overflow-hidden font-sans text-gray-900 relative select-none touch-none overscroll-none">
      
      <!-- Lock Screen for Password Protection -->
      @if (isLocked()) {
        <div class="fixed inset-0 z-[100] bg-stone-900 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
           <div class="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mb-8 border-2 border-stone-700 shadow-2xl">
              <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
           </div>
           
           <h2 class="text-3xl font-bold text-white mb-2">프라이빗 캡슐</h2>
           <p class="text-stone-400 mb-8 max-w-md break-keep">이 캡슐은 참여 코드가 필요합니다.<br>초대받은 비밀번호를 입력해주세요.</p>

           <div class="w-full max-w-xs space-y-4">
              <input 
                 #passwordInput
                 type="password" 
                 class="w-full px-6 py-4 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-center font-bold text-xl tracking-widest outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                 placeholder="PASSCODE"
                 (keyup.enter)="unlock(passwordInput.value)"
              >
              <button (click)="unlock(passwordInput.value)" class="w-full py-4 bg-white text-stone-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg transform active:scale-95">
                 입장하기
              </button>
              
              @if (lockError()) {
                 <p class="text-red-500 text-sm font-bold animate-pulse">비밀번호가 올바르지 않습니다.</p>
              }

              <button (click)="goBack()" class="block w-full py-4 text-stone-500 text-sm hover:text-stone-300 transition">돌아가기</button>
           </div>
        </div>
      }

      <!-- Top Bar -->
      <header class="fixed top-0 left-0 right-0 z-50 p-3 md:p-4 pointer-events-none flex justify-between items-start h-16 md:h-20">
        <!-- Back & Title -->
        <div class="pointer-events-auto flex items-center gap-2 md:gap-3 z-50">
           <button (click)="goBack()" class="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition active:scale-95">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
           </button>
           <div class="bg-white/90 backdrop-blur px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-2 hidden sm:flex">
             <h1 class="font-bold text-xs md:text-sm text-gray-800 max-w-[100px] md:max-w-xs truncate">{{ capsule()?.name }}</h1>
             @if (isReadOnly()) { <span class="text-[10px] text-gray-500 font-bold whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full border border-gray-300">READ ONLY</span> }
           </div>
        </div>

        <!-- Center Timer -->
        <div class="pointer-events-none absolute left-1/2 transform -translate-x-1/2 top-3 md:top-4 z-40 w-full flex justify-center">
           <div class="bg-black/80 backdrop-blur-md text-white px-4 py-2 md:px-6 md:py-2 rounded-full shadow-xl flex items-center gap-2 md:gap-3 border border-white/10 transition-all" [class.bg-gray-800]="isReadOnly()">
              <span class="w-2 h-2 rounded-full flex-shrink-0" [class.bg-red-500]="!isReadOnly()" [class.animate-pulse]="!isReadOnly()" [class.bg-gray-500]="isReadOnly()"></span>
              <div class="font-mono text-sm md:text-xl font-bold tracking-widest whitespace-nowrap">
                {{ timeLeft() }}
              </div>
           </div>
        </div>

        <!-- Right Tools -->
        <div class="pointer-events-auto flex items-center gap-2 md:gap-3 z-50">
          <div class="bg-white/90 backdrop-blur px-2 py-1.5 md:px-3 md:py-2 rounded-full shadow-md border border-gray-200 flex -space-x-2 hidden md:flex">
             @for (cursor of otherCursors().slice(0,3); track cursor.userId) {
                <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold" [style.background-color]="cursor.color">
                   {{ cursor.userName.charAt(0) }}
                </div>
             }
             <div class="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-bold">
                {{ otherCursors().length + 1 }}
             </div>
          </div>

          <button (click)="toggleSidebar()" class="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-indigo-600 transition relative active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              @if (chatMessages().length > 0) {
                 <span class="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              }
          </button>
        </div>
      </header>
      
      <!-- Zoom Controls (Bottom Left) -->
      <div class="fixed bottom-28 md:bottom-8 left-4 z-40 flex flex-col gap-2 pointer-events-auto">
         <div class="bg-white/90 backdrop-blur rounded-lg shadow-lg border border-gray-200 flex flex-col overflow-hidden">
            <button (click)="zoomIn()" class="p-3 hover:bg-gray-100 text-gray-600 border-b border-gray-100 active:bg-gray-200">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </button>
            <button (click)="resetZoom()" class="p-2 text-xs font-bold text-gray-500 hover:bg-gray-100 active:bg-gray-200">
               {{ (zoomScale() * 100).toFixed(0) }}%
            </button>
            <button (click)="zoomOut()" class="p-3 hover:bg-gray-100 text-gray-600 border-t border-gray-100 active:bg-gray-200">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
            </button>
         </div>
      </div>

      <!-- Bottom Toolbar (Fixed) -->
      @if (!isReadOnly() && !isLocked()) {
        <div class="fixed bottom-6 md:bottom-8 left-0 right-0 z-40 pointer-events-none flex justify-center px-4">
          <div class="bg-white/95 backdrop-blur-md border border-gray-200 px-3 py-2 shadow-2xl rounded-2xl flex gap-1 md:gap-2 pointer-events-auto overflow-x-auto max-w-full custom-scrollbar touch-pan-x">
             <!-- Tools -->
             <button 
                (click)="activeTool.set('cursor')"
                [class.bg-gray-900]="activeTool() === 'cursor'" 
                [class.text-white]="activeTool() === 'cursor'" 
                [class.text-gray-400]="activeTool() !== 'cursor'"
                class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl transition-all active:scale-95"
                title="이동/편집"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
              </button>
              
              <div class="w-px bg-gray-200 my-2 mx-1"></div>
              
              <button (click)="openMediaModal('image')" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95" title="사진">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </button>

              <button (click)="openMediaModal('gif')" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95" title="GIF">
                <span class="font-bold text-xs">GIF</span>
              </button>

               <button (click)="openMediaModal('video')" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95" title="동영상">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </button>
               
              <button (click)="openDrawingModal()" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95" title="그리기">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>

               <button (click)="addTextPrompt()" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95" title="글쓰기">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
              </button>

              <button (click)="openMediaModal('audio')" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95" title="오디오/음성녹음">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </button>
          </div>
        </div>
      }

      <div class="flex flex-1 overflow-hidden relative">
        <!-- Sidebar (Chat) -->
        <div 
          class="bg-white/95 backdrop-blur-md border-l border-gray-200 w-full md:w-96 flex flex-col transition-transform duration-300 absolute right-0 top-0 bottom-0 z-50 shadow-2xl"
          [class.translate-x-full]="!isSidebarOpen()"
          [class.translate-x-0]="isSidebarOpen()"
        >
          <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <div class="flex items-center gap-2">
               <span class="font-bold text-gray-800 text-lg">대화</span>
               <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{{ chatMessages().length }}</span>
             </div>
             <button (click)="isSidebarOpen.set(false)" class="p-2 -mr-2 text-gray-400 hover:text-gray-600 active:bg-gray-200 rounded-full">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            @for (msg of chatMessages(); track msg.id) {
              <div class="flex flex-col animate-fade-in" [class.items-end]="msg.userId === currentUser()?.id" [class.items-start]="msg.userId !== currentUser()?.id">
                 <div class="flex items-end gap-2 max-w-[85%]">
                    @if (msg.userId !== currentUser()?.id) {
                       <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold shrink-0 shadow-sm" [style.background-color]="msg.color">
                          {{ msg.userName.charAt(0) }}
                       </div>
                    }
                    <div 
                      class="px-4 py-2.5 text-base md:text-sm"
                      [class.bg-gray-800]="msg.userId === currentUser()?.id"
                      [class.text-white]="msg.userId === currentUser()?.id"
                      [class.rounded-2xl]="true"
                      [class.rounded-tr-none]="msg.userId === currentUser()?.id"
                      [class.bg-gray-100]="msg.userId !== currentUser()?.id"
                      [class.text-gray-800]="msg.userId !== currentUser()?.id"
                      [class.rounded-tl-none]="msg.userId !== currentUser()?.id"
                    >
                      {{ msg.text }}
                    </div>
                 </div>
                 <span class="text-[10px] text-gray-400 mt-1 mx-1">{{ msg.timestamp | date:'shortTime' }}</span>
              </div>
            }
          </div>

          <div class="p-3 bg-white border-t border-gray-100 safe-area-pb">
             <form (submit)="sendChat($event)" class="flex gap-2 relative">
               <input 
                 #chatInput
                 type="text" 
                 class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" 
                 placeholder="메시지 입력..."
               >
               <button type="submit" class="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition active:scale-95 shadow-sm">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
               </button>
             </form>
          </div>
        </div>

        <!-- Main Canvas -->
        <div 
          #canvasContainer
          class="flex-1 overflow-hidden bg-gray-100 relative custom-scrollbar w-full h-full overscroll-none touch-none"
          [class.cursor-grab]="!isDragging() && !isPanning"
          [class.cursor-grabbing]="isPanning"
          [class.cursor-move]="isDragging()"
          (mousedown)="onMouseDown($event)"
          (touchstart)="onTouchStart($event)"
          (mousemove)="onMouseMove($event)"
          (touchmove)="onTouchMove($event)"
          (mouseup)="onMouseUp()"
          (mouseleave)="onMouseUp()"
          (touchend)="onMouseUp()"
          (wheel)="onWheel($event)"
          (dragover)="$event.preventDefault()"
          (drop)="onDrop($event)"
        >
          <!-- Transformed Content Wrapper -->
          <div 
             class="origin-top-left transition-transform duration-75 ease-out will-change-transform"
             [style.transform]="'translate3d(' + panX() + 'px, ' + panY() + 'px, 0) scale(' + zoomScale() + ')'"
          >
            <div 
              #captureArea
              class="bg-white shadow-xl relative"
              style="width: 2000px; height: 2000px;"
            >
              <!-- Canvas Grid -->
               <div class="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none"></div>

              <div class="absolute top-24 left-6 flex flex-col pointer-events-none opacity-50">
                 <span class="text-xs font-mono text-gray-400">CANVAS ID</span>
                 <span class="font-mono text-xl font-bold text-gray-300 tracking-wider">
                   #{{ capsule()?.id?.substring(0,8) }}
                 </span>
              </div>

              <!-- Empty State -->
              @if (items().length === 0) {
                 <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
                    <div class="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                       <span class="text-4xl text-gray-300">+</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-400">비어있는 캔버스</h3>
                    <p class="text-gray-400 text-sm mt-1">배경을 드래그하여 이동할 수 있습니다</p>
                 </div>
              }

              <!-- Items (Optimized with translate3d) -->
              @if (!isLocked()) {
                @for (item of items(); track item.id) {
                  <div 
                    class="absolute group cursor-move select-none will-change-transform"
                    [style.transform]="'translate3d(' + item.x + 'px, ' + item.y + 'px, 0)'"
                    [style.width.px]="item.width"
                    [style.zIndex]="item.zIndex"
                    (mousedown)="startDrag($event, item)"
                    (touchstart)="startDragTouch($event, item)"
                    (touchend)="onMouseUp()"
                  >
                    <!-- Content Wrapper -->
                    <div 
                      class="relative transition-all duration-200 ring-2 ring-transparent group-hover:ring-indigo-300 shadow-md bg-white rounded-lg overflow-hidden"
                      [class.ring-indigo-500]="isDragging() && draggedItem()?.id === item.id"
                      [class.shadow-2xl]="isDragging() && draggedItem()?.id === item.id"
                      [class.scale-[1.02]]="isDragging() && draggedItem()?.id === item.id"
                    >
                       @switch (item.type) {
                          @case ('image') {
                            <img [src]="item.content" class="w-full h-auto object-cover pointer-events-none block select-none" loading="lazy">
                          }
                          @case ('gif') {
                            <img [src]="item.content" class="w-full h-auto object-cover pointer-events-none block select-none" alt="GIF" loading="lazy">
                          }
                          @case ('drawing') {
                            <img [src]="item.content" class="w-full h-auto pointer-events-none block bg-transparent select-none" loading="lazy">
                          }
                          @case ('video') {
                            <video [src]="item.content" controls class="w-full h-auto bg-black"></video>
                          }
                          @case ('audio') {
                             <div class="p-3 bg-gray-50 flex items-center justify-center min-w-[200px] border border-gray-100">
                               <audio [src]="item.content" controls class="w-full h-8"></audio>
                             </div>
                          }
                          @default {
                            <div class="p-6 bg-yellow-50 border border-yellow-100 text-gray-800 text-lg min-h-[100px] flex items-center justify-center text-center whitespace-pre-wrap leading-relaxed select-none">
                              {{ item.content }}
                            </div>
                          }
                       }
                    </div>
                  </div>
                }
              }

              <!-- Remote Cursors (Optimized with translate3d) -->
              @if (!isCapturing && !isLocked()) {
                @for (cursor of otherCursors(); track cursor.userId) {
                   <div 
                     class="absolute pointer-events-none transition-transform duration-100 ease-linear z-[9999] will-change-transform"
                     [style.transform]="'translate3d(' + cursor.x + 'px, ' + cursor.y + 'px, 0)'"
                   >
                      <!-- Digital Arrow Cursor -->
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                         <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" [attr.fill]="cursor.color" stroke="white" stroke-width="2"/>
                      </svg>
                      <div 
                        class="absolute left-4 top-4 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold rounded shadow-sm whitespace-nowrap origin-top-left"
                        [style.transform]="'scale(' + (1/zoomScale()) + ')'"
                        [style.background-color]="cursor.color"
                      >
                        {{ cursor.userName }}
                      </div>
                   </div>
                }
              }
            </div>
          </div>
        </div>
        
        <!-- Notifications -->
        <div class="fixed bottom-36 md:bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-50 w-full px-4">
           @for (note of notifications(); track note) {
              <div class="bg-gray-800/90 backdrop-blur text-white text-sm px-6 py-2 rounded-full shadow-lg animate-fade-in">
                {{ note }}
              </div>
           }
        </div>
      </div>

      <!-- Expiration / Archive Modal -->
      @if (showExpirationModal()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
           <div class="bg-white rounded-3xl p-1 shadow-2xl w-full max-w-lg transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div class="bg-stone-100 border-4 border-white rounded-[20px] p-8 text-center relative overflow-hidden">
                 <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
                 
                 <div class="mb-6">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm text-3xl mb-4">🔒</div>
                    <h2 class="text-3xl font-black text-stone-900 mb-2">여정이 끝났습니다!</h2>
                    <p class="text-stone-500">{{ getDurationLabel(capsule()?.duration || '') }} 간의 기록이 보관되었습니다.</p>
                 </div>

                 <div class="bg-white p-6 rounded-xl shadow-inner border border-stone-200 mb-6 rotate-1">
                    <h3 class="font-handwriting text-2xl text-stone-800 mb-2">"{{ capsule()?.name }}"</h3>
                    <p class="text-xs text-stone-400 font-mono uppercase tracking-widest">{{ capsule()?.createdDate | date:'mediumDate' }} — {{ expirationDate | date:'mediumDate' }}</p>
                    <p class="text-xs text-stone-400 mt-2">{{ items().length }}개의 기억</p>
                 </div>

                 <p class="text-sm text-stone-400 mb-6 break-keep">
                    이 캡슐은 이제 <b>'지난 추억 보관함'</b>으로 이동합니다.<br>
                    캔버스는 초기화되어 새로운 추억을 기다리게 됩니다.
                 </p>
                 
                 <div class="flex flex-col gap-3 justify-center">
                    <button (click)="downloadSnapshot()" class="w-full px-6 py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2">
                       <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                       <span>기억 다운로드 (이미지)</span>
                    </button>

                    <button (click)="archiveAndResetCapsule()" class="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
                       <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                       <span>보관함에 저장하고 초기화</span>
                    </button>
                    
                    <button (click)="goBack()" class="flex-1 px-6 py-3 text-sm text-stone-400 hover:text-stone-600 font-medium transition mt-2">홈으로 돌아가기</button>
                 </div>
              </div>
           </div>
        </div>
      }

      <!-- Media Modal (Lazy Loaded with @defer) -->
      @defer (when showMediaModal()) {
        @if (showMediaModal()) {
          <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div class="bg-white shadow-2xl w-full max-w-lg rounded-2xl overflow-hidden h-[600px] flex flex-col">
               <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                   <h3 class="text-lg font-bold text-gray-900 capitalize">
                      {{ mediaType() === 'gif' ? 'GIF 검색' : mediaType() + ' 추가' }}
                   </h3>
                   <button (click)="showMediaModal.set(false)" class="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
               </div>
              
              <div class="p-4 grid grid-cols-3 gap-2 flex-shrink-0">
                 @if (mediaType() === 'image') {
                   <button (click)="mediaTab.set('gen')" class="py-2 text-sm font-bold rounded-lg transition-all" [class.bg-indigo-600]="mediaTab() === 'gen'" [class.text-white]="mediaTab() === 'gen'" [class.bg-gray-100]="mediaTab() !== 'gen'" [class.text-gray-500]="mediaTab() !== 'gen'">AI 생성</button>
                 }
                 @if (mediaType() === 'audio') {
                   <button (click)="mediaTab.set('record')" class="py-2 text-sm font-bold rounded-lg transition-all" [class.bg-indigo-600]="mediaTab() === 'record'" [class.text-white]="mediaTab() === 'record'" [class.bg-gray-100]="mediaTab() !== 'record'" [class.text-gray-500]="mediaTab() !== 'record'">녹음</button>
                 }
                 @if (mediaType() === 'gif') {
                    <button class="py-2 text-sm font-bold rounded-lg bg-indigo-600 text-white col-span-3">GIF 검색</button>
                 } @else {
                    <button (click)="mediaTab.set('file')" class="py-2 text-sm font-bold rounded-lg transition-all" [class.bg-indigo-600]="mediaTab() === 'file'" [class.text-white]="mediaTab() === 'file'" [class.bg-gray-100]="mediaTab() !== 'file'" [class.text-gray-500]="mediaTab() !== 'file'">업로드</button>
                    <button (click)="mediaTab.set('url')" class="py-2 text-sm font-bold rounded-lg transition-all" [class.bg-indigo-600]="mediaTab() === 'url'" [class.text-white]="mediaTab() === 'url'" [class.bg-gray-100]="mediaTab() !== 'url'" [class.text-gray-500]="mediaTab() !== 'url'">링크</button>
                 }
              </div>

              <div class="px-6 pb-6 flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
                @if (mediaTab() === 'gen' && mediaType() === 'image') {
                  <div class="space-y-4">
                     <textarea 
                        #promptInput
                        class="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-32" 
                        placeholder="생성할 이미지를 묘사해주세요..."
                      ></textarea>
                     <button 
                        (click)="generateImage(promptInput.value)" 
                        [disabled]="isGenerating()"
                        class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition"
                      >
                        @if (isGenerating()) { <span class="animate-pulse">생성 중...</span> }
                        @else { 생성하기 }
                      </button>
                  </div>
                } @else if (mediaType() === 'gif') {
                   <div class="space-y-4">
                      <div class="sticky top-0 z-10 bg-gray-50 pt-1 pb-4">
                         <div class="flex gap-2">
                            <input 
                              #gifSearchInput
                              type="text"
                              class="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none shadow-sm"
                              placeholder="GIF 검색 (예: 웃긴, 고양이...)"
                              (keyup.enter)="searchGifs(gifSearchInput.value)"
                            >
                            <button (click)="searchGifs(gifSearchInput.value)" class="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 transition shadow-sm">
                               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                         </div>
                      </div>
                      
                      @if (showGifFallback()) {
                         <div class="text-center py-2 text-xs text-gray-500 animate-fade-in bg-yellow-50 border border-yellow-100 rounded-lg p-2">
                            🧐 "<b>{{ lastGifQuery }}</b>"에 대한 정확한 결과가 없어 인기 짤들을 모아봤어요!
                         </div>
                      }
                      
                      <div class="columns-2 md:columns-3 gap-4 px-1 pb-4 space-y-4">
                         @for (gif of gifResults(); track gif) {
                            <div (click)="addMediaUrl(gif, 'gif')" class="break-inside-avoid cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:ring-4 hover:ring-indigo-300 transition-all duration-300 bg-gray-100 shadow-sm hover:shadow-md group relative">
                               <img [src]="gif" class="w-full h-auto block" loading="lazy">
                            </div>
                         }
                      </div>
                   </div>
                } @else if (mediaTab() === 'record' && mediaType() === 'audio') {
                   <div class="text-center py-8">
                      @if (!isRecording) {
                         <button (click)="startRecording()" class="w-20 h-20 bg-red-500 rounded-full shadow-lg flex items-center justify-center mx-auto hover:bg-red-600 transition hover:scale-105 active:scale-95">
                            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                         </button>
                         <p class="mt-4 text-gray-500 font-bold">버튼을 눌러 녹음 시작</p>
                      } @else {
                         <div class="w-20 h-20 bg-white border-4 border-red-500 rounded-full shadow-lg flex items-center justify-center mx-auto animate-pulse cursor-pointer" (click)="stopRecording()">
                            <div class="w-8 h-8 bg-red-500 rounded-md"></div>
                         </div>
                         <p class="mt-4 text-red-500 font-bold animate-pulse">녹음 중...</p>
                      }
                   </div>
                } @else if (mediaTab() === 'file') {
                  <div class="border-2 border-dashed border-gray-300 bg-white rounded-xl py-12 text-center hover:bg-gray-50 cursor-pointer transition h-full flex flex-col justify-center" (click)="fileInput.click()">
                    <input #fileInput type="file" [accept]="getFileAccept()" class="hidden" (change)="onFileSelected($event)">
                    <span class="block text-gray-400 mb-1">파일 선택</span>
                    <span class="text-xs text-gray-300">
                       @if(mediaType() === 'image') { (JPG, PNG, GIF) }
                       @if(mediaType() === 'video') { (MP4, WEBM) }
                       @if(mediaType() === 'audio') { (MP3, WAV) }
                    </span>
                  </div>
                } @else {
                   <div class="space-y-4">
                     <input 
                       #urlInput
                       type="text" 
                       class="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                       placeholder="https://..."
                     >
                     <button (click)="addMediaUrl(urlInput.value)" class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition active:scale-95">추가하기</button>
                   </div>
                }
              </div>
            </div>
          </div>
        }
      }

      <!-- Drawing Modal (Lazy Loaded with @defer) -->
      @defer (when showDrawingModal()) {
        @if (showDrawingModal()) {
          <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
             <div class="bg-white rounded-2xl shadow-2xl w-full h-full md:w-auto md:h-auto md:max-w-5xl flex flex-col overflow-hidden">
                <div class="flex justify-between items-center p-4 border-b border-gray-100 flex-shrink-0">
                   <h3 class="font-bold text-lg">스케치</h3>
                   <div class="flex gap-2">
                      <button (click)="showDrawingModal.set(false)" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-bold active:scale-95">취소</button>
                      <button (click)="saveDrawing()" class="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 active:scale-95">저장</button>
                   </div>
                </div>

                <div class="flex flex-col md:flex-row h-full overflow-hidden">
                  <!-- Palette -->
                  <div class="bg-gray-50 p-4 border-r border-gray-200 md:w-48 space-y-6 flex flex-row md:flex-col overflow-x-auto md:overflow-visible flex-shrink-0">
                     <div>
                        <label class="text-xs font-bold text-gray-400 block mb-2">COLOR</label>
                        <div class="grid grid-cols-8 md:grid-cols-4 gap-2">
                           @for (color of palette; track color) {
                             <button 
                               (click)="setDrawColor(color)" 
                               class="w-8 h-8 rounded-lg shadow-sm border border-black/10 transition-transform hover:scale-110 flex-shrink-0"
                               [style.background-color]="color"
                               [class.ring-2]="drawColor === color"
                               [class.ring-offset-1]="drawColor === color"
                               [class.ring-indigo-500]="drawColor === color"
                             ></button>
                           }
                        </div>
                     </div>
                     
                     <div class="hidden md:block">
                        <label class="text-xs font-bold text-gray-400 block mb-2">SIZE: {{ lineWidth }}px</label>
                        <input type="range" min="1" max="20" [(ngModel)]="lineWidth" (change)="updateLineWidth()" class="w-full accent-indigo-600 h-2 bg-gray-200 rounded-full appearance-none">
                     </div>

                     <button (click)="clearDrawing()" class="w-full py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 hidden md:block active:scale-95">초기화</button>
                  </div>

                  <div class="flex-1 bg-gray-200 overflow-hidden flex items-center justify-center p-4 touch-none">
                     <canvas 
                      #drawingCanvas 
                      width="800" 
                      height="600" 
                      class="bg-white shadow-lg cursor-crosshair touch-none rounded-lg max-w-full h-auto object-contain"
                      (mousedown)="startDrawing($event)"
                      (mousemove)="draw($event)"
                      (mouseup)="stopDrawing()"
                      (mouseleave)="stopDrawing()"
                      (touchstart)="startDrawingTouch($event)"
                      (touchmove)="drawTouch($event)"
                      (touchend)="stopDrawing()"
                    ></canvas>
                  </div>
                </div>
             </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .font-handwriting { font-family: cursive; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    /* Ensure bottom safe area for iPhone X+ */
    .safe-area-pb {
      padding-bottom: env(safe-area-inset-bottom, 20px);
    }
    
    .touch-pan-x {
      touch-action: pan-x;
    }
  `]
})
export class CapsuleDetailComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  capsuleService = inject(CapsuleService);
  authService = inject(AuthService);
  collabService = inject(CollabService);
  geminiService = inject(GeminiService);
  gifService = inject(GifService);

  capsule = signal<Capsule | undefined>(undefined);
  items = signal<CapsuleItem[]>([]);
  timeLeft = signal<string>('00:00:00');
  
  // Access Control & Expiration State
  isLocked = signal(false);
  lockError = signal(false);
  isReadOnly = signal(false);
  showExpirationModal = signal(false);
  expirationDate: Date | null = null;
  
  currentUser = this.authService.currentUser;
  
  // Collab Signals
  otherCursors = this.collabService.activeCursors;
  chatMessages = this.collabService.chatMessages;
  notifications = this.collabService.notifications;

  activeTool = signal<'cursor'>('cursor');
  isSidebarOpen = signal(false); 
  
  // Transform State (Pan & Zoom)
  panX = signal(-500); // Default Center roughly for 1920 screen (2000px canvas)
  panY = signal(-500);
  zoomScale = signal(1);
  
  // Interaction State
  isDragging = signal(false);
  draggedItem = signal<CapsuleItem | null>(null);
  dragOffset = { x: 0, y: 0 };
  
  isPanning = false;
  lastMousePos = { x: 0, y: 0 };
  
  // Touch Gestures
  lastTouchDistance = 0;
  isPinching = false;
  
  // Performance Throttling
  lastCursorUpdate = 0;
  
  // Media Modal
  showMediaModal = signal(false);
  mediaType = signal<'image' | 'video' | 'audio' | 'gif'>('image'); 
  mediaTab = signal<'gen' | 'url' | 'file' | 'record'>('gen');
  isGenerating = signal(false);
  gifResults = signal<string[]>([]);
  showGifFallback = signal(false);
  lastGifQuery = '';

  // Audio Recording
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  // Drawing State
  showDrawingModal = signal(false);
  isDrawing = false;
  drawColor = '#111827'; 
  lineWidth = 4;
  palette = ['#111827', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
  
  // Snapshot
  isCapturing = false;
  
  @ViewChild('drawingCanvas') drawingCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('captureArea') captureArea!: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;
  
  private timerSub?: Subscription;

  constructor() {
     effect(() => {
      const update = this.collabService.remoteUpdates();
      if (update && this.capsule()) {
         if (update.type === 'CAPSULE_RESET') {
             this.loadCapsule(this.capsule()!.id); // Reload full state
             this.showExpirationModal.set(false);
             this.isReadOnly.set(false);
         } else {
            const fresh = this.capsuleService.getCapsule(this.capsule()!.id);
            if (fresh) {
               this.items.set(fresh.items);
            }
         }
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCapsule(id);
      }
    });

    if (window.innerWidth >= 1024) {
       this.isSidebarOpen.set(true);
    }
    
    // Center the view initially
    this.centerView();
  }
  
  centerView() {
     if (typeof window !== 'undefined') {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Canvas is 2000x2000
        this.panX.set((w - 2000) / 2);
        this.panY.set((h - 2000) / 2);
        this.zoomScale.set(Math.min(1, w / 1000)); // Scale down initially on small screens
     }
  }

  loadCapsule(id: string) {
    const c = this.capsuleService.getCapsule(id);
    if (c) {
      this.capsule.set(c);
      
      // Password Protection Check
      const user = this.currentUser();
      const isCreator = user && user.id === c.creatorId;
      
      // If capsule has password and user is not creator, LOCK IT
      if (c.password && !isCreator) {
         this.isLocked.set(true);
      } else {
         this.initializeCapsuleContent(c);
      }
    }
  }

  unlock(password: string) {
     const c = this.capsule();
     if (!c) return;
     
     if (password === c.password) {
        this.isLocked.set(false);
        this.lockError.set(false);
        this.initializeCapsuleContent(c);
     } else {
        this.lockError.set(true);
     }
  }

  initializeCapsuleContent(c: Capsule) {
    this.items.set(c.items);
    this.expirationDate = this.capsuleService.getExpirationDate(c);
    
    // Check for expiration
    if (this.capsuleService.isExpired(c)) {
       this.setReadOnlyMode();
    } else {
       this.isReadOnly.set(false);
       this.startTimer(c);
    }
    
    const user = this.currentUser();
    const userId = user?.id || 'guest_' + Math.floor(Math.random() * 10000);
    this.collabService.init(userId, c.id);
  }

  setReadOnlyMode() {
    this.isReadOnly.set(true);
    this.timeLeft.set('EXPIRED');
    
    if (this.capsule()?.archivedDate) {
       this.showExpirationModal.set(false);
       this.timeLeft.set('ARCHIVED');
    } else {
       setTimeout(() => {
          this.showExpirationModal.set(true);
       }, 500);
    }
  }

  startTimer(capsule: Capsule) {
    if (this.timerSub) this.timerSub.unsubscribe();
    
    const expiration = this.capsuleService.getExpirationDate(capsule).getTime();
    
    this.timerSub = interval(1000).subscribe(() => {
      const now = Date.now();
      const diff = expiration - now;
      
      if (diff <= 0) {
        this.setReadOnlyMode();
        this.timerSub?.unsubscribe();
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        let display = '';
        if (days > 0) display += `${days}d `;
        display += `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
        this.timeLeft.set(display);
      }
    });
  }

  async downloadSnapshot() {
     this.isCapturing = true; // Hides cursors
     
     // Need to wait for angular change detection if we used *ngIf
     setTimeout(() => {
        if (typeof html2canvas !== 'undefined' && this.captureArea) {
           html2canvas(this.captureArea.nativeElement, {
              scale: 2, // Better quality
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff'
           }).then((canvas: HTMLCanvasElement) => {
              const link = document.createElement('a');
              link.download = `time_capsuffle_${this.capsule()?.name || 'memory'}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              
              this.isCapturing = false;
           }).catch((err: any) => {
              console.error(err);
              alert('스크린샷 저장 중 오류가 발생했습니다.');
              this.isCapturing = false;
           });
        }
     }, 100);
  }

  archiveAndResetCapsule() {
     const c = this.capsule();
     if (c) {
        this.capsuleService.archiveAndResetCapsule(c.id);
        this.collabService.broadcastCapsuleReset();
        
        this.showExpirationModal.set(false);
        this.router.navigate(['/home']);
     }
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  getDurationLabel(value: string): string {
    const map: Record<string, string> = {
      '1d': '24시간', '1w': '7일', '1m': '30일', '1y': '365일'
    };
    return map[value] || value;
  }

  ngOnDestroy() {
    this.collabService.leave();
    if (this.timerSub) this.timerSub.unsubscribe();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  sendChat(event: Event) {
    event.preventDefault();
    if (!this.chatInput) return;
    const text = this.chatInput.nativeElement.value.trim();
    if (!text) return;
    const user = this.currentUser();
    this.collabService.broadcastChat(text, user?.name || 'Guest', user?.avatarColor || '#6B7280');
    this.chatInput.nativeElement.value = '';
  }

  // --- Zoom Logic ---

  zoomIn() {
    this.updateZoom(0.1);
  }

  zoomOut() {
    this.updateZoom(-0.1);
  }

  resetZoom() {
    this.zoomScale.set(1);
    this.centerView();
  }

  updateZoom(delta: number) {
    const newScale = Math.min(Math.max(0.2, this.zoomScale() + delta), 4);
    this.zoomScale.set(newScale);
  }

  onWheel(event: WheelEvent) {
     event.preventDefault();
     
     if (event.ctrlKey || Math.abs(event.deltaY) < 10) { 
        // Pinch zoom trackpad
        const delta = -event.deltaY * 0.005;
        const scale = this.zoomScale();
        const newScale = Math.min(Math.max(0.2, scale + delta), 4);
        this.zoomScale.set(newScale);
     } else {
        // Pan
        this.panX.update(x => x - event.deltaX);
        this.panY.update(y => y - event.deltaY);
     }
  }

  // --- Coordinate Helper ---
  
  getCanvasPoint(clientX: number, clientY: number) {
     const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
     const relX = clientX - rect.left;
     const relY = clientY - rect.top;
     
     return {
        x: (relX - this.panX()) / this.zoomScale(),
        y: (relY - this.panY()) / this.zoomScale()
     };
  }

  // --- Interaction (Pan, Zoom, Drag) ---

  onMouseDown(event: MouseEvent) {
     if (this.isLocked() || this.isDragging()) return; 
     
     this.isPanning = true;
     this.lastMousePos = { x: event.clientX, y: event.clientY };
  }
  
  onMouseMove(event: MouseEvent) {
    if (this.isLocked()) return;
    
    if (this.isPanning) {
       event.preventDefault();
       const dx = event.clientX - this.lastMousePos.x;
       const dy = event.clientY - this.lastMousePos.y;
       
       this.panX.update(x => x + dx);
       this.panY.update(y => y + dy);
       
       this.lastMousePos = { x: event.clientX, y: event.clientY };
       return; 
    }

    // Cursor Broadcast
    const pt = this.getCanvasPoint(event.clientX, event.clientY);
    this.handleCursorAndItemDrag(pt.x, pt.y);
  }

  onTouchStart(event: TouchEvent) {
    if (this.isLocked()) return;

    if (event.touches.length === 2) {
       this.isPinching = true;
       this.lastTouchDistance = this.getTouchDistance(event.touches);
       return;
    }

    // Don't start panning if we are dragging an item
    if (this.isDragging()) return;
    
    // Pan
    this.isPanning = true;
    const touch = event.touches[0];
    this.lastMousePos = { x: touch.clientX, y: touch.clientY };
  }

  onTouchMove(event: TouchEvent) {
    if (this.isLocked()) return;
    if (event.cancelable) event.preventDefault(); // Critical: Prevent browser scrolling
    
    // Pinch Zoom
    if (this.isPinching && event.touches.length === 2) {
       const dist = this.getTouchDistance(event.touches);
       const delta = dist - this.lastTouchDistance;
       const zoomDelta = delta * 0.005; 
       const newScale = Math.min(Math.max(0.2, this.zoomScale() + zoomDelta), 4);
       this.zoomScale.set(newScale);
       this.lastTouchDistance = dist;
       return;
    }

    // Panning (Only if not pinching and not dragging an item)
    if (this.isPanning && event.touches.length === 1 && !this.isDragging()) {
      const touch = event.touches[0];
      const dx = touch.clientX - this.lastMousePos.x;
      const dy = touch.clientY - this.lastMousePos.y;
      
      this.panX.update(x => x + dx);
      this.panY.update(y => y + dy);
      
      this.lastMousePos = { x: touch.clientX, y: touch.clientY };
      return;
    }

    // Cursor Broadcast (Mobile)
    if (event.touches.length === 1) {
       const touch = event.touches[0];
       const pt = this.getCanvasPoint(touch.clientX, touch.clientY);
       this.handleCursorAndItemDrag(pt.x, pt.y);
    }
  }
  
  getTouchDistance(touches: TouchList) {
     const t1 = touches[0];
     const t2 = touches[1];
     const dx = t1.clientX - t2.clientX;
     const dy = t1.clientY - t2.clientY;
     return Math.sqrt(dx * dx + dy * dy);
  }

  handleCursorAndItemDrag(x: number, y: number) {
    const now = Date.now();
    if (now - this.lastCursorUpdate > 50) { 
       const user = this.currentUser();
       this.collabService.broadcastCursor(x, y, user?.name || 'Guest', user?.avatarColor || '#6B7280');
       this.lastCursorUpdate = now;
    }

    if (this.isDragging() && this.draggedItem() && !this.isReadOnly()) {
       const item = this.draggedItem()!;
       
       let newX = x - this.dragOffset.x;
       let newY = y - this.dragOffset.y;
       
       newX = Math.max(0, Math.min(newX, 2000 - item.width));
       newY = Math.max(0, Math.min(newY, 2000 - (item.height || 100)));
       
       this.items.update(items => items.map(i => i.id === item.id ? { ...i, x: newX, y: newY } : i));
    }
  }

  onMouseUp() {
    this.isPanning = false;
    this.isPinching = false;

    if (this.isDragging() && this.draggedItem() && !this.isReadOnly()) {
      const c = this.capsule();
      if (c) {
        this.capsuleService.updateCapsuleItems(c.id, this.items());
        this.collabService.broadcastItemUpdate(this.items());
      }
    }
    this.isDragging.set(false);
    this.draggedItem.set(null);
  }

  startDrag(event: MouseEvent, item: CapsuleItem) {
    if (this.isReadOnly() || this.isLocked()) return;
    event.stopPropagation();
    event.preventDefault();
    
    const pt = this.getCanvasPoint(event.clientX, event.clientY);
    
    this.isDragging.set(true);
    this.draggedItem.set(item);
    
    this.dragOffset = {
       x: pt.x - item.x,
       y: pt.y - item.y
    };
  }

  startDragTouch(event: TouchEvent, item: CapsuleItem) {
    if (this.isReadOnly() || this.isLocked()) return;
    event.stopPropagation();
    if (event.cancelable) event.preventDefault();
    
    const touch = event.touches[0];
    const pt = this.getCanvasPoint(touch.clientX, touch.clientY);
    
    this.isDragging.set(true);
    this.draggedItem.set(item);
    
    this.dragOffset = {
       x: pt.x - item.x,
       y: pt.y - item.y
    };
  }

  onDrop(event: DragEvent) {
    if (this.isReadOnly() || this.isLocked()) return;
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
         this.mediaType.set('video');
         this.handleFile(file);
      } else if (file.type.startsWith('audio/')) {
         this.mediaType.set('audio');
         this.handleFile(file);
      } else {
         this.mediaType.set('image');
         this.handleFile(file);
      }
    }
  }

  openMediaModal(type: 'image' | 'video' | 'audio' | 'gif') {
    if (this.isReadOnly()) return;
    this.mediaType.set(type);
    this.showMediaModal.set(true);
    
    if (type === 'image') this.mediaTab.set('gen');
    else if (type === 'audio') this.mediaTab.set('record');
    else if (type === 'gif') this.searchGifs(''); // Init gifs
    else this.mediaTab.set('file'); 
  }
  
  async searchGifs(query: string) {
     const q = query.toLowerCase().trim();
     this.lastGifQuery = q;
     this.showGifFallback.set(false);
     
     const results = await this.gifService.searchGifs(q);
     
     if (results.length > 0) {
        this.gifResults.set(results);
     } else {
        this.showGifFallback.set(true);
     }
  }

  getFileAccept() {
     const type = this.mediaType();
     if (type === 'image') return 'image/*';
     if (type === 'video') return 'video/*';
     if (type === 'audio') return 'audio/*';
     return '*/*';
  }

  async generateImage(prompt: string) {
    if (!prompt.trim()) return;
    this.isGenerating.set(true);
    const base64 = await this.geminiService.generateImage(prompt);
    if (base64) {
      this.addItem('image', base64, 300, 300);
      this.showMediaModal.set(false);
    } else {
      alert('이미지 생성에 실패했습니다.');
    }
    this.isGenerating.set(false);
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
             const base64 = reader.result as string;
             this.addItem('audio', base64, 300, 100);
             this.showMediaModal.set(false);
          };
          this.isRecording = false;
        };
      })
      .catch(err => {
         console.error('Mic Error:', err);
         alert('마이크 권한이 필요합니다.');
      });
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
       this.mediaRecorder.stop();
       this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  addMediaUrl(url: string, typeOverride?: 'gif') {
    if (url) {
      const type = typeOverride || this.mediaType(); 
      let w = 300, h = 300;
      if (type === 'audio') { w = 300; h = 100; }
      this.addItem(type as any, url, w, h);
      this.showMediaModal.set(false);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        let type: 'image' | 'video' | 'audio' = 'image';
        if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';
        else type = 'image';

        if (this.mediaType() !== 'audio' && type === 'audio') {
        } else if (this.mediaType() === 'audio' && type !== 'audio') {
           return; 
        }
        
        let w = 300, h = 300;
        if (type === 'audio') { w = 300; h = 100; }
        
        this.addItem(type, result, w, h);
        this.showMediaModal.set(false);
      }
    };
    reader.readAsDataURL(file);
  }

  addTextPrompt() {
    if (this.isReadOnly()) return;
    const text = prompt('내용을 입력하세요:');
    if (text) {
      this.addItem('text', text, 240, 160);
    }
  }

  private addItem(type: CapsuleItem['type'], content: string, w: number, h: number) {
    if (this.isReadOnly()) return;

    const c = this.capsule();
    const user = this.currentUser();
    if (!c) return;
    
    const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    
    const pt = this.getCanvasPoint(rect.left + cx, rect.top + cy);

    const x = pt.x - (w / 2);
    const y = pt.y - (h / 2);

    const newItem: CapsuleItem = {
      id: crypto.randomUUID(),
      type,
      content,
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: w,
      height: h,
      zIndex: this.items().length + 1,
      authorId: user?.id || 'guest'
    };

    this.capsuleService.addItemToCapsule(c.id, newItem);
    this.items.update(prev => [...prev, newItem]);
    this.collabService.broadcastItemAdd(newItem);
  }

  openDrawingModal() {
    if (this.isReadOnly()) return;
    this.showDrawingModal.set(true);
    setTimeout(() => {
      if (this.drawingCanvas) {
        this.ctx = this.drawingCanvas.nativeElement.getContext('2d')!;
        this.updateContext();
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0,0, this.drawingCanvas.nativeElement.width, this.drawingCanvas.nativeElement.height);
      }
    }, 100);
  }

  updateContext() {
    if (!this.ctx) return;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.drawColor;
  }

  setDrawColor(color: string) {
    this.drawColor = color;
    this.updateContext();
  }

  updateLineWidth() {
    this.updateContext();
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
  }

  startDrawingTouch(event: TouchEvent) {
    event.preventDefault();
    this.isDrawing = true;
    const touch = event.touches[0];
    const rect = this.drawingCanvas.nativeElement.getBoundingClientRect();
    this.ctx.beginPath();
    this.ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
  }

  drawTouch(event: TouchEvent) {
    event.preventDefault();
    if (!this.isDrawing) return;
    const touch = event.touches[0];
    const rect = this.drawingCanvas.nativeElement.getBoundingClientRect();
    this.ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearDrawing() {
    const w = this.drawingCanvas.nativeElement.width;
    const h = this.drawingCanvas.nativeElement.height;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, w, h);
  }

  saveDrawing() {
    const dataUrl = this.drawingCanvas.nativeElement.toDataURL('image/png');
    this.addItem('drawing', dataUrl, 300, 225);
    this.showDrawingModal.set(false);
  }
}