import { Component, inject, signal, effect, ElementRef, ViewChild, OnDestroy, OnInit, ChangeDetectionStrategy, AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CapsuleService, Capsule, CapsuleItem } from '../../services/capsule.service';
import { AuthService, User } from '../../services/auth.service';
import { CollabService } from '../../services/collab.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';

declare var html2canvas: any; 
declare var EXIF: any;

interface Projectile {
  id: string;
  x: number;
  y: number;
  image: string;
  targetId: string;
  speed: number;
}

interface Explosion {
  id: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-capsule-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile: Use 100dvh to fix address bar resizing issues. touch-action: none prevents browser gestures. -->
    <div class="h-[100dvh] w-screen flex flex-col bg-stone-200 overflow-hidden font-sans text-gray-900 relative select-none touch-none overscroll-none">
      
      <!-- GAME UI LAYER (Top Most) -->
      <div class="pointer-events-none fixed inset-0 z-[100]">
        
        <!-- Game Mode Controls (Visible when Active Tool is 'game') -->
        @if (activeTool() === 'game') {
           <!-- Mobile Touch Controls -->
           <div class="absolute bottom-8 left-8 flex gap-4 pointer-events-auto md:hidden">
              <button 
                 (touchstart)="setMobileInput('left', true)" (touchend)="setMobileInput('left', false)" (touchcancel)="setMobileInput('left', false)"
                 oncontextmenu="return false;"
                 class="w-16 h-16 bg-white/50 backdrop-blur rounded-full border-2 border-white flex items-center justify-center active:bg-white/80 transition touch-manipulation shadow-lg"
              >
                 <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                 (touchstart)="setMobileInput('right', true)" (touchend)="setMobileInput('right', false)" (touchcancel)="setMobileInput('right', false)"
                 oncontextmenu="return false;"
                 class="w-16 h-16 bg-white/50 backdrop-blur rounded-full border-2 border-white flex items-center justify-center active:bg-white/80 transition touch-manipulation shadow-lg"
              >
                 <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>
           
           <div class="absolute bottom-8 right-8 pointer-events-auto md:hidden">
              <button 
                 (touchstart)="setMobileInput('up', true)" (touchend)="setMobileInput('up', false)" (touchcancel)="setMobileInput('up', false)"
                 oncontextmenu="return false;"
                 class="w-20 h-20 bg-red-500/80 backdrop-blur rounded-full border-4 border-white flex items-center justify-center active:bg-red-600 active:scale-95 transition shadow-lg text-white font-bold touch-manipulation"
              >
                 JUMP
              </button>
           </div>

           <!-- Exit Game Button -->
           <div class="absolute top-24 right-4 pointer-events-auto">
              <button (click)="exitGameMode()" class="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs hover:bg-red-700 transition">
                 게임 종료 (Exit)
              </button>
           </div>
           
           <!-- Instructions / Spawn Mode -->
           @if (isPlacingCharacter()) {
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
                 <div class="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl border-4 border-white">
                    👇 캐릭터가 생성될 위치를 클릭하세요!
                 </div>
              </div>
           } @else {
              <div class="absolute top-24 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-xs font-bold pointer-events-none hidden md:block">
                 방향키(← →)이동 / 스페이스바(Jump) / 게시물을 밟고 올라가보세요!
              </div>
           }
        }

        <!-- Voting Phase UI -->
        @if (voteState() === 'voting') {
          <div class="absolute top-20 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-8 py-3 rounded-full shadow-2xl animate-bounce flex flex-col items-center pointer-events-auto border-4 border-white transition-all">
            <span class="text-xs font-bold uppercase tracking-widest text-indigo-200">DELETE VOTE</span>
            <div class="text-3xl font-black font-mono">{{ voteTimer() }}s</div>
            <p class="text-[10px] mt-1 font-bold">삭제하고 싶은 기억을 선택하세요!</p>
          </div>
        }

        <!-- Destruction Phase UI -->
        @if (voteState() === 'destruction' && destructionTargetId()) {
          <div class="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-full shadow-2xl animate-pulse flex flex-col items-center border-4 border-white transition-all">
            <span class="text-xs font-bold uppercase tracking-widest text-red-200">DESTROY MODE</span>
            <div class="text-3xl font-black font-mono">{{ destructionTimer() }}s</div>
          </div>
          
          <!-- Launch Control (Bottom Right) -->
          @if (mySpaceship()) {
             <div class="absolute bottom-32 right-6 pointer-events-auto flex flex-col items-center gap-2 animate-fade-in">
                <div class="bg-black/80 backdrop-blur p-2 rounded-lg text-white text-xs font-bold mb-2">
                   남은 발사 횟수: {{ 5 - launchCount() }}
                </div>
                <button 
                  (click)="launchSpaceship()" 
                  [disabled]="launchCount() >= 5"
                  class="w-24 h-24 bg-red-500 rounded-full shadow-xl border-4 border-white flex items-center justify-center hover:scale-110 active:scale-90 transition-transform disabled:opacity-50 disabled:scale-100 disabled:grayscale relative overflow-hidden group"
                >
                   <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <img [src]="mySpaceship()" class="w-16 h-16 object-contain transform -rotate-45 drop-shadow-md">
                </button>
                <span class="text-sm font-bold text-red-600 bg-white px-3 py-1 rounded-full shadow-lg border border-red-100">발사!</span>
             </div>
          }
        }
      </div>

      <!-- --- MODALS START --- -->

      <!-- Media Upload Modal (Overlay) -->
      @if (showMediaModal()) {
        <div class="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
           <div class="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
              <div class="flex justify-between items-center mb-6">
                 <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                    @if (mediaType() === 'image') { 📷 사진 추가 }
                    @else if (mediaType() === 'video') { 🎥 동영상 추가 }
                    @else { 🎙️ 오디오 추가 }
                 </h3>
                 <button (click)="showMediaModal.set(false); stopStream(); stopAudioRecording()" class="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <!-- Audio Recorder UI -->
              @if (mediaType() === 'audio') {
                 <div class="py-8 flex flex-col items-center">
                    @if (!isRecording) {
                       <button (click)="startAudioRecording()" class="w-20 h-20 bg-red-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform mb-4">
                          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                       </button>
                       <p class="text-gray-500">버튼을 눌러 녹음 시작</p>
                    } @else {
                       <div class="w-20 h-20 border-4 border-red-500 rounded-full flex items-center justify-center mb-4 animate-pulse relative">
                          <div class="w-8 h-8 bg-red-500 rounded-sm"></div>
                          <button (click)="stopAudioRecording()" class="absolute inset-0 w-full h-full"></button>
                       </div>
                       <p class="text-red-500 font-mono font-bold text-xl">{{ recordingTimeDisplay() }}</p>
                       <p class="text-gray-400 text-xs mt-2">최대 60초</p>
                    }
                 </div>
              } 
              <!-- Image/Video UI -->
              @else {
                 <div class="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                    <button (click)="mediaTab.set('file')" class="flex-1 py-2 rounded-md text-sm font-bold transition" [class.bg-white]="mediaTab() === 'file'" [class.shadow-sm]="mediaTab() === 'file'">파일 업로드</button>
                    <button (click)="openCamera()" class="flex-1 py-2 rounded-md text-sm font-bold transition" [class.bg-white]="mediaTab() === 'camera'" [class.shadow-sm]="mediaTab() === 'camera'">카메라 촬영</button>
                 </div>

                 @if (mediaTab() === 'file') {
                    <div 
                       class="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center transition-colors hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer mb-4"
                       (click)="triggerFileUpload()"
                       (dragover)="$event.preventDefault()"
                       (drop)="onDrop($event)"
                    >
                       <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                       </div>
                       <p class="text-sm font-bold text-gray-700">여기를 클릭하여 파일 선택</p>
                       <p class="text-xs text-gray-400 mt-1">또는 파일을 여기로 드래그하세요</p>
                       <input #fileInput type="file" class="hidden" [accept]="getFileAccept()" (change)="onFileSelected($event)">
                    </div>

                    <div class="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-left cursor-pointer transition" [class.animate-shake]="shakeVerification" (click)="toggleVerification()">
                       <label class="flex items-start gap-3 cursor-pointer">
                          <div class="relative flex items-center mt-0.5">
                             <input type="checkbox" [checked]="verificationChecked" class="w-5 h-5 border-2 border-yellow-500 rounded text-yellow-500 focus:ring-yellow-500 transition cursor-pointer">
                          </div>
                          <div class="text-xs text-yellow-800 leading-relaxed select-none">
                             <strong>확인해주세요:</strong> 이 파일은 본인이 직접 촬영하거나 제작한 콘텐츠입니다. 타인의 저작물이나 인터넷에서 다운로드한 이미지가 아님을 확인합니다.
                          </div>
                       </label>
                    </div>
                 } 
                 @else if (mediaTab() === 'camera') {
                    <div class="relative bg-black rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                       <video #videoPreview autoplay playsinline muted class="w-full h-full object-cover"></video>
                       
                       @if (!videoStream) {
                          <div class="absolute inset-0 flex items-center justify-center">
                             <button (click)="mediaType() === 'video' ? startVideoRecording() : startVideoRecording()" class="text-white underline">카메라 권한 허용하기</button>
                          </div>
                       }
                       
                       @if (videoStream) {
                          <div class="absolute bottom-4 left-0 right-0 flex justify-center">
                             @if (!isRecording) {
                                <button (click)="mediaType() === 'video' ? startVideoRecording() : startVideoRecording()" class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                                   <div class="w-14 h-14 bg-white rounded-full active:scale-90 transition-transform"></div>
                                </button>
                             } @else {
                                <button (click)="stopVideoRecording()" class="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center">
                                   <div class="w-8 h-8 bg-red-500 rounded-sm"></div>
                                </button>
                             }
                          </div>
                       }
                    </div>
                    <p class="text-xs text-gray-500">직접 촬영한 콘텐츠는 별도 인증 없이 업로드됩니다.</p>
                 }
              }
           </div>
        </div>
      }

      <!-- Drawing Modal (Transparent Overlay) -->
      @if (showDrawingModal()) {
         <div class="fixed inset-0 z-[150] flex flex-col animate-fade-in pointer-events-auto">
            <!-- Transparent Toolbar -->
            <div class="px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md shadow-lg z-10 m-4 rounded-full border border-white/20">
               <button (click)="showDrawingModal.set(false)" class="text-white font-bold hover:text-red-400 transition">취소 (Cancel)</button>
               <h3 class="font-bold text-white text-lg drop-shadow-md">화면 위에 그리기</h3>
               <button (click)="saveDrawing()" class="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-500 transition shadow-lg">완료 (Done)</button>
            </div>
            
            <!-- Fullscreen Transparent Canvas -->
            <div class="absolute inset-0 touch-none cursor-crosshair">
               <canvas 
                  #drawingCanvas 
                  [width]="windowWidth" 
                  [height]="windowHeight" 
                  class="w-full h-full block"
                  (mousedown)="startDrawing($event)" 
                  (mousemove)="draw($event)" 
                  (mouseup)="stopDrawing()" 
                  (mouseleave)="stopDrawing()"
                  (touchstart)="startDrawingTouch($event)" 
                  (touchmove)="drawTouch($event)" 
                  (touchend)="stopDrawing()"
               ></canvas>
            </div>

            <!-- Floating Bottom Tools -->
            <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 p-4 rounded-3xl safe-area-pb shadow-2xl flex flex-col gap-4 min-w-[300px]">
               <div class="flex justify-between items-center">
                  <div class="flex gap-2">
                     @for (color of palette; track color) {
                        <button 
                           (click)="setDrawColor(color)" 
                           class="w-8 h-8 rounded-full border-2 transition-transform active:scale-125"
                           [style.background-color]="color"
                           [class.border-white]="drawColor !== color"
                           [class.border-indigo-400]="drawColor === color"
                           [class.scale-125]="drawColor === color"
                        ></button>
                     }
                  </div>
                  <div class="w-px h-8 bg-gray-600 mx-2"></div>
                  <button (click)="clearDrawing()" class="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-white/10 transition">
                     <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
               </div>
               <div class="px-2">
                  <input type="range" min="1" max="20" [(ngModel)]="lineWidth" (change)="updateLineWidth()" class="w-full accent-indigo-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer">
               </div>
            </div>
         </div>
      }

      <!-- Text Modal -->
      @if (showTextModal()) {
         <div class="fixed inset-0 z-[200] bg-black/50 flex items-end md:items-center justify-center sm:p-4 backdrop-blur-sm animate-fade-in">
            <div class="bg-white w-full md:w-[500px] md:rounded-3xl rounded-t-3xl p-6 shadow-2xl">
               <div class="flex justify-between items-center mb-4">
                  <h3 class="font-bold text-lg">텍스트 남기기</h3>
                  <button (click)="showTextModal.set(false)" class="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                     <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
               
               <textarea 
                  [(ngModel)]="textModalValue" 
                  class="w-full h-40 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-lg font-handwriting resize-none focus:ring-2 focus:ring-yellow-400 outline-none mb-4 placeholder-yellow-300 text-gray-800"
                  placeholder="여기에 추억을 기록하세요..."
               ></textarea>
               
               <div class="flex gap-2 overflow-x-auto pb-2 mb-4 custom-scrollbar">
                  <button (click)="pickRandomQuestion()" class="flex-shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 hover:bg-indigo-100">🎲 질문 추천받기</button>
               </div>

               <button (click)="submitText()" class="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition">
                  기록하기
               </button>
            </div>
         </div>
      }

      <!-- Sticker Modal -->
      @if (showStickerModal()) {
         <div class="fixed inset-0 z-[200] bg-black/50 flex items-end md:items-center justify-center sm:p-4 backdrop-blur-sm animate-fade-in" (click)="showStickerModal.set(false)">
            <div class="bg-white w-full md:w-[400px] md:rounded-3xl rounded-t-3xl p-6 shadow-2xl" (click)="$event.stopPropagation()">
               <h3 class="font-bold text-lg mb-4 text-center">스티커 붙이기</h3>
               <div class="grid grid-cols-4 gap-4">
                  @for (emoji of stickers; track emoji) {
                     <button (click)="addSticker(emoji)" class="text-4xl p-4 hover:bg-gray-100 rounded-2xl transition transform active:scale-90 flex items-center justify-center">
                        {{ emoji }}
                     </button>
                  }
               </div>
            </div>
         </div>
      }

      <!-- Spaceship Drawing Modal (Overlay) -->
      @if (showSpaceshipModal()) {
         <div class="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div class="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
               <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
               
               <h3 class="text-2xl font-black text-gray-900 mb-2">🚀 비행선 그리기</h3>
               <p class="text-gray-500 text-sm mb-6 break-keep">타겟을 공격할 나만의 비행선을 그려주세요!</p>
               
               <div class="border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/50 mb-6 flex justify-center overflow-hidden relative shadow-inner">
                  <canvas #spaceshipCanvas width="200" height="200" class="cursor-crosshair touch-none"
                    (mousedown)="startSpaceshipDraw($event)" (mousemove)="drawSpaceship($event)" (mouseup)="stopSpaceshipDraw()" (mouseleave)="stopSpaceshipDraw()"
                    (touchstart)="startSpaceshipDrawTouch($event)" (touchmove)="drawSpaceshipTouch($event)" (touchend)="stopSpaceshipDraw()"
                  ></canvas>
                  <div class="absolute top-3 right-3 flex gap-1">
                     <button (click)="clearSpaceshipCanvas()" class="text-xs font-bold bg-white text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition shadow-sm">지우기</button>
                  </div>
               </div>
               
               <button (click)="saveSpaceship()" class="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg transform active:scale-95 flex items-center justify-center gap-2">
                  <span>준비 완료!</span>
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
            </div>
         </div>
      }

      <!-- --- MODALS END --- -->

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
      
      <!-- Zoom & Pan Controls (Bottom Left) -->
      @if (activeTool() !== 'game') {
        <div class="fixed bottom-28 md:bottom-8 left-4 z-40 flex flex-col gap-2 pointer-events-auto">
           <div class="bg-white/90 backdrop-blur rounded-lg shadow-lg border border-gray-200 flex flex-col overflow-hidden">
              <button (click)="zoomIn()" class="p-3 hover:bg-gray-100 text-gray-600 border-b border-gray-100 active:bg-gray-200" title="확대">
                 <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
              <button (click)="resetZoom()" class="p-2 text-xs font-bold text-gray-500 hover:bg-gray-100 active:bg-gray-200" title="비율 초기화">
                 {{ (zoomScale() * 100).toFixed(0) }}%
              </button>
              <button (click)="zoomOut()" class="p-3 hover:bg-gray-100 text-gray-600 border-t border-gray-100 active:bg-gray-200" title="축소">
                 <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
              </button>
           </div>
           
           <button (click)="centerView()" class="bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border border-gray-200 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 transition" title="중앙으로 이동">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
           </button>
        </div>
      }

      <!-- Bottom Toolbar (Fixed) -->
      @if (!isReadOnly() && !isLocked() && activeTool() !== 'game') {
        <div class="fixed bottom-6 md:bottom-8 left-0 right-0 z-40 pointer-events-none flex justify-center px-4">
          <div class="bg-white/95 backdrop-blur-md border border-gray-200 px-3 py-2 shadow-2xl rounded-2xl flex gap-3 pointer-events-auto overflow-x-auto max-w-full custom-scrollbar touch-pan-x items-center">
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
              
              <div class="w-px h-8 bg-gray-300 mx-1"></div>
              
              <!-- Separated Buttons for Image, Video, Audio -->
              <button (click)="openMediaModal('image')" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-600 bg-gray-50 hover:bg-indigo-100 hover:text-indigo-600 transition-all active:scale-95" title="사진 추가">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </button>

              <button (click)="openMediaModal('video')" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-600 bg-gray-50 hover:bg-indigo-100 hover:text-indigo-600 transition-all active:scale-95" title="동영상 추가">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>

              <button (click)="openDrawingModal()" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-600 bg-gray-50 hover:bg-indigo-100 hover:text-indigo-600 transition-all active:scale-95" title="그리기">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>

               <button (click)="openTextModal()" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-600 bg-gray-50 hover:bg-indigo-100 hover:text-indigo-600 transition-all active:scale-95" title="글쓰기">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
              </button>

              <button (click)="openMediaModal('audio')" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-gray-600 bg-gray-50 hover:bg-indigo-100 hover:text-indigo-600 transition-all active:scale-95" title="음성 녹음">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </button>
              
              <button (click)="openStickerModal()" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-amber-500 bg-amber-50 hover:bg-amber-100 transition-all active:scale-95 border border-amber-100" title="스티커">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>

              <!-- Game Mode Button (Character Icon - Big Body Bean) -->
              <button (click)="startGameMode()" class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 transition-all active:scale-95 border border-purple-100" title="게임 모드 (내 캐릭터 소환)">
                <!-- Big Body Small Legs Character Icon -->
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                   <!-- Body: Large rounded rect -->
                   <rect x="6" y="4" width="12" height="14" rx="6" />
                   <!-- Legs: Short lines at bottom -->
                   <path d="M10 18v4 M14 18v4" />
                </svg>
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
          class="flex-1 overflow-hidden relative custom-scrollbar w-full h-full overscroll-none touch-none bg-stone-200"
          [class.cursor-grab]="!isDragging() && !isPanning && activeTool() !== 'game' && !isPlacingCharacter()"
          [class.cursor-grabbing]="isPanning"
          [class.cursor-move]="isDragging()"
          [class.cursor-crosshair]="isPlacingCharacter()"
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
            <!-- Canvas Sheet -->
            <div 
              #captureArea
              class="bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative border-4 border-white"
              style="width: 4000px; height: 4000px;"
            >
              <!-- Grid Pattern -->
               <div class="absolute inset-0 pointer-events-none"
                    style="background-image: linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px); background-size: 40px 40px;">
               </div>
               
               <!-- Center Marker -->
               <div class="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 border-t-2 border-l-2 border-indigo-400 opacity-50 pointer-events-none"></div>
               <div class="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 border-b-2 border-r-2 border-indigo-400 opacity-50 pointer-events-none"></div>

               <!-- Game Floor Visualization (Optional) -->
               <div class="absolute left-0 w-full h-1 bg-gray-300 border-t border-gray-400 pointer-events-none opacity-50" [style.top.px]="3500"></div>

              <div class="absolute top-24 left-6 flex flex-col pointer-events-none opacity-50">
                 <span class="text-xs font-mono text-gray-400">CANVAS ID</span>
                 <span class="font-mono text-xl font-bold text-gray-300 tracking-wider">
                   #{{ capsule()?.id?.substring(0,8) }}
                 </span>
              </div>

              <!-- Items -->
              @if (!isLocked()) {
                @for (item of items(); track item.id) {
                  <!-- Handle Game Character Rendering specifically -->
                  @if (item.type === 'character') {
                     <div 
                        class="absolute transition-transform will-change-transform"
                        [style.transform]="'translate3d(' + item.x + 'px, ' + item.y + 'px, 0)'"
                        [style.width.px]="item.width"
                        [style.height.px]="item.height"
                        [style.zIndex]="item.zIndex"
                     >
                        <canvas 
                          [attr.data-id]="item.id"
                          class="w-full h-full"
                          width="128" height="128"
                        ></canvas>
                        
                        <!-- Player Name Badge -->
                        @if (item.characterData) {
                           <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap backdrop-blur-sm border border-white/20">
                              {{ item.authorId === currentUser()?.id ? '나(ME)' : item.authorId }}
                           </div>
                        }
                     </div>
                  } @else {
                     <!-- Normal Items -->
                     <div 
                       class="absolute group cursor-move select-none will-change-transform"
                       [style.transform]="'translate3d(' + item.x + 'px, ' + item.y + 'px, 0)'"
                       [style.width.px]="item.width"
                       [style.zIndex]="(selectedItemId() === item.id) ? 9999 : item.zIndex"
                       (mousedown)="startDrag($event, item)"
                       (touchstart)="startDragTouch($event, item)"
                       (click)="selectItem($event, item)"
                       (touchend)="onMouseUp()"
                     >
                       <!-- NEW Styled Delete Button (Author Only) -->
                       @if (selectedItemId() === item.id && (currentUser()?.id === item.authorId || currentUser()?.id === capsule()?.creatorId)) {
                          <button 
                             (click)="$event.stopPropagation(); deleteItem($event, item)"
                             (pointerdown)="$event.stopPropagation()"
                             (mousedown)="$event.stopPropagation()"
                             (touchstart)="$event.stopPropagation()"
                             class="absolute -top-4 -right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl border-[3px] border-white flex items-center justify-center transform transition-all z-[100] hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer"
                             title="삭제하기"
                          >
                             <!-- Trash Icon -->
                             <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                          </button>
                       }
   
                       <!-- Content Wrapper -->
                       <div 
                         class="relative transition-all duration-200 ring-2 ring-transparent group-hover:ring-indigo-300 shadow-md bg-white rounded-lg overflow-hidden"
                         [class.ring-indigo-500]="(isDragging() && draggedItem()?.id === item.id) || selectedItemId() === item.id"
                         [class.ring-4]="selectedItemId() === item.id"
                         [class.shadow-2xl]="isDragging() && draggedItem()?.id === item.id"
                         [class.scale-[1.02]]="isDragging() && draggedItem()?.id === item.id"
                         [class.bg-transparent]="item.type === 'sticker' || item.type === 'drawing'"
                         [class.shadow-none]="item.type === 'sticker' || item.type === 'drawing'"
                       >
                          @switch (item.type) {
                             @case ('image') {
                               <img [src]="item.content" class="w-full h-auto object-cover pointer-events-none block select-none" loading="lazy">
                             }
                             @case ('gif') {
                               <img [src]="item.content" class="w-full h-auto object-cover pointer-events-none block select-none" alt="GIF" loading="lazy">
                             }
                             @case ('sticker') {
                               <div class="w-full h-full flex items-center justify-center text-[100px] leading-none select-none pointer-events-none drop-shadow-xl filter hover:brightness-110 transition-all">
                                  {{ item.content }}
                               </div>
                             }
                             @case ('drawing') {
                               <img [src]="item.content" class="w-full h-auto pointer-events-none block bg-transparent select-none drop-shadow-md" loading="lazy">
                             }
                             @case ('video') {
                               @if (isYouTube(item.content)) {
                                  <div class="relative w-full h-full bg-black group-video">
                                     @if (playingVideoId() === item.id) {
                                        <iframe 
                                          [src]="getYouTubeEmbed(item.content)" 
                                          class="w-full h-full" 
                                          frameborder="0" 
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                          allowfullscreen>
                                        </iframe>
                                        <button (click)="stopVideo($event)" class="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black text-white p-1 rounded-full">
                                           <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                     } @else {
                                        <img [src]="getYouTubeThumbnail(item.content)" class="w-full h-full object-cover pointer-events-none opacity-80" loading="lazy">
                                        <div class="absolute inset-0 flex items-center justify-center">
                                           <button (click)="playVideo(item.id)" class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                              <svg class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                           </button>
                                        </div>
                                        <div class="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">YouTube</div>
                                     }
                                  </div>
                               } @else {
                                  <video [src]="item.content" controls class="w-full h-auto bg-black" (mousedown)="$event.stopPropagation()"></video>
                               }
                             }
                             @case ('audio') {
                                <div class="p-3 bg-gray-50 flex items-center justify-center min-w-[200px] border border-gray-100">
                                  <audio [src]="item.content" controls class="w-full h-8" (mousedown)="$event.stopPropagation()"></audio>
                                </div>
                             }
                             @default {
                               <div class="p-6 bg-yellow-100 border border-yellow-200 text-gray-800 text-lg min-h-[100px] flex items-center justify-center text-center whitespace-pre-wrap leading-relaxed select-none shadow-sm font-handwriting">
                                 {{ item.content }}
                               </div>
                             }
                          }
                       </div>
                     </div>
                  }
                }
              }
              
              <!-- Game Projectiles -->
              @for (proj of projectiles(); track proj.id) {
                 <div class="absolute z-[80] pointer-events-none w-12 h-12 will-change-transform drop-shadow-md"
                    [style.transform]="'translate3d(' + proj.x + 'px, ' + proj.y + 'px, 0)'">
                    <img [src]="proj.image" class="w-full h-full object-contain transform -rotate-45">
                 </div>
              }
              
              <!-- Game Explosions -->
              @for (exp of explosions(); track exp.id) {
                 <div class="absolute z-[90] pointer-events-none w-24 h-24 flex items-center justify-center"
                   [style.transform]="'translate3d(' + (exp.x - 48) + 'px, ' + (exp.y - 48) + 'px, 0)'">
                    <div class="w-full h-full bg-orange-500 rounded-full animate-ping opacity-75"></div>
                    <div class="absolute w-16 h-16 bg-yellow-300 rounded-full animate-pulse mix-blend-screen"></div>
                 </div>
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
      </div>
      
      <!-- Spawn Instruction Overlay -->
      @if (isPlacingCharacter()) {
          <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-2xl z-[1000] animate-bounce cursor-none pointer-events-none border-4 border-white">
             👇 캐릭터가 생성될 위치를 클릭하세요!
          </div>
      }
    </div>
  `,
  styles: [`
    .font-handwriting { font-family: cursive; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

    /* Ensure bottom safe area for iPhone X+ */
    .safe-area-pb {
      padding-bottom: env(safe-area-inset-bottom, 20px);
    }
    
    .touch-pan-x {
      touch-action: pan-x;
    }

    .group-video iframe {
       pointer-events: auto; /* Allow interaction */
    }
  `]
})
export class CapsuleDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  capsuleService: CapsuleService = inject(CapsuleService);
  authService: AuthService = inject(AuthService);
  collabService: CollabService = inject(CollabService);
  sanitizer: DomSanitizer = inject(DomSanitizer);
  ngZone: NgZone = inject(NgZone); // Injected NgZone

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

  activeTool = signal<'cursor' | 'game'>('cursor');
  isSidebarOpen = signal(false); 
  
  // Transform State (Pan & Zoom)
  panX = signal(-500); 
  panY = signal(-500);
  zoomScale = signal(1);
  
  // Interaction State
  isDragging = signal(false);
  draggedItem = signal<CapsuleItem | null>(null);
  selectedItemId = signal<string | null>(null);
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
  mediaType = signal<'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'ai'>('image'); 
  mediaTab = signal<'ai' | 'url' | 'file' | 'camera' | 'record'>('file');
  
  // File Verification UI
  verificationChecked = false;
  shakeVerification = false;
  
  // Video & Audio State
  playingVideoId = signal<string | null>(null);
  videoStream: MediaStream | null = null;
  @ViewChild('videoPreview') videoPreview?: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // Audio/Video Recording
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  recordingTimer: any = null;
  recordingSeconds = 0;

  // Drawing State
  showDrawingModal = signal(false);
  isDrawing = false;
  drawColor = '#111827'; 
  lineWidth = 4;
  palette = ['#111827', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#FFFFFF'];
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  
  // Sticker & Text Modal State
  showStickerModal = signal(false);
  showTextModal = signal(false);
  textModalValue = '';
  stickers = ['❤️', '😂', '🔥', '🎉', '👍', '👀', '✨', '🚀', '🎂', '📸', '🎁', '💌', '💡', '🎵', '🐶', '🐱'];
  questions = [
    '지금 가장 먹고 싶은 음식은?', 
    '10년 뒤 나에게 하고 싶은 한마디', 
    '오늘의 TMI 하나!', 
    '요즘 꽂힌 노래는?', 
    '최근에 꾼 가장 기억에 남는 꿈은?', 
    '만약 로또 1등에 당첨된다면?',
    '지금 당신의 기분은 어떤가요?',
    '가장 좋아하는 계절과 그 이유는?'
  ];

  // Game & Voting State
  voteState = signal<'idle' | 'voting' | 'destruction' | 'ended'>('idle');
  voteTimer = signal(20);
  destructionTimer = signal(30);
  voteCounts = signal<Record<string, number>>({});
  myVote = signal<string | null>(null);
  destructionTargetId = signal<string | null>(null);
  targetHealth = signal(30);
  
  // Spaceship Game State
  showSpaceshipModal = signal(false);
  mySpaceship = signal<string | null>(null);
  launchCount = signal(0);
  projectiles = signal<Projectile[]>([]);
  explosions = signal<Explosion[]>([]);
  
  private gameLoopId: any;
  
  @ViewChild('spaceshipCanvas') spaceshipCanvas!: ElementRef<HTMLCanvasElement>;
  private spaceCtx!: CanvasRenderingContext2D;

  // --- Character Game State ---
  private physicsLoopId: any;
  inputState = { left: false, right: false, up: false };
  myCharacterId: string | null = null;
  globalFrameTicker = 0;
  isPlacingCharacter = signal(false);
  
  // Remote Character Interpolation Map
  // Key: Item ID, Value: Target {x, y} to lerp towards
  remoteTargets = new Map<string, {x: number, y: number, data?: any}>();
  
  // Constants
  private readonly GRAVITY = 0.5;
  private readonly FRICTION = 0.8;
  private readonly MOVE_SPEED = 5;
  private readonly JUMP_FORCE = -15;
  private readonly FLOOR_Y = 3500; // Bottom of canvas
  
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
             this.loadCapsule(this.capsule()!.id); 
             this.showExpirationModal.set(false);
             this.isReadOnly.set(false);
         } else if (update.type === 'CHARACTER_UPDATE') {
             this.handleRemoteCharacterUpdate(update.payload);
         } else {
            const fresh = this.capsuleService.getCapsule(this.capsule()!.id);
            if (fresh) {
               // Merge items carefully to not jitter physics
               const newItems = fresh.items;
               const nonChars = newItems.filter(i => i.type !== 'character');
               const myChar = this.items().find(i => i.id === this.myCharacterId);
               
               this.items.update(current => {
                   const remotes = current.filter(i => i.type === 'character' && i.id !== this.myCharacterId);
                   return [...nonChars, ...(myChar ? [myChar] : []), ...remotes];
               });
            }
         }
      }
      
      const gameEvent = this.collabService.gameEvents();
      if (gameEvent) {
         this.handleGameEvent(gameEvent);
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
    
    this.centerView();
    
    // Keyboard Listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  ngAfterViewInit() {
     this.startPhysicsLoop();
  }
  
  onResize() {
     this.windowWidth = window.innerWidth;
     this.windowHeight = window.innerHeight;
  }
  
  // --- Character Logic ---

  startGameMode() {
     if (this.isReadOnly()) return;
     this.activeTool.set('game');
     
     const myExisting = this.items().find(i => i.type === 'character' && i.authorId === this.currentUser()?.id);
     if (myExisting) {
        this.myCharacterId = myExisting.id;
        this.centerOnCharacter();
     } else {
        this.isPlacingCharacter.set(true);
        this.collabService.addNotification('캐릭터를 생성할 위치를 클릭하세요!');
     }
  }

  exitGameMode() {
     this.activeTool.set('cursor');
     this.isPlacingCharacter.set(false);
     this.inputState = { left: false, right: false, up: false };

     if (this.myCharacterId) {
        const newItems = this.items().filter(i => i.id !== this.myCharacterId);
        this.items.set(newItems);
        if (this.capsule()) {
           this.capsuleService.updateCapsuleItems(this.capsule()!.id, newItems);
        }
        this.collabService.broadcastItemUpdate(newItems);
        this.myCharacterId = null;
     }
  }

  spawnCharacterAt(x: number, y: number) {
     const newItem: CapsuleItem = {
        id: crypto.randomUUID(),
        type: 'character',
        content: 'sprite_default',
        x: x - 64,
        y: y - 128,
        width: 128, 
        height: 128,
        zIndex: 5000,
        authorId: this.currentUser()?.id || 'guest',
        characterData: {
           vx: 0, vy: 0,
           state: 'idle',
           direction: 'right',
           color: this.currentUser()?.avatarColor || '#000',
           playerId: this.currentUser()?.id || 'guest'
        }
     };

     this.capsuleService.addItemToCapsule(this.capsule()!.id, newItem);
     this.items.update(prev => [...prev, newItem]);
     this.myCharacterId = newItem.id;
     this.collabService.broadcastItemAdd(newItem);
     this.spawnExplosion(newItem.x + 64, newItem.y + 64);
  }

  handleKeyDown(e: KeyboardEvent) {
     if (this.activeTool() !== 'game') return;
     if (e.code === 'ArrowLeft') this.inputState.left = true;
     if (e.code === 'ArrowRight') this.inputState.right = true;
     if (e.code === 'Space' || e.code === 'ArrowUp') this.inputState.up = true;
  }

  handleKeyUp(e: KeyboardEvent) {
     if (this.activeTool() !== 'game') return;
     if (e.code === 'ArrowLeft') this.inputState.left = false;
     if (e.code === 'ArrowRight') this.inputState.right = false;
     if (e.code === 'Space' || e.code === 'ArrowUp') this.inputState.up = false;
  }
  
  setMobileInput(key: 'left' | 'right' | 'up', value: boolean) {
     this.inputState[key] = value;
  }

  startPhysicsLoop() {
     // Run outside Angular to prevent excessive Change Detection on every frame
     this.ngZone.runOutsideAngular(() => {
        const loop = () => {
           if (this.activeTool() === 'game') {
              if (this.myCharacterId) {
                 this.updateMyCharacterPhysics();
              }
              // Interpolate remote characters
              this.updateRemotePhysics();
           }
           this.drawCharacters(); 
           this.physicsLoopId = requestAnimationFrame(loop);
        };
        this.physicsLoopId = requestAnimationFrame(loop);
     });
  }

  updateMyCharacterPhysics() {
     const items = this.items();
     const myIndex = items.findIndex(i => i.id === this.myCharacterId);
     if (myIndex === -1) return;

     const char = { ...items[myIndex] };
     if (!char.characterData) return;
     const phys = char.characterData;
     
     if (this.inputState.left) {
        phys.vx = -this.MOVE_SPEED;
        phys.direction = 'left';
        phys.state = 'run';
     } else if (this.inputState.right) {
        phys.vx = this.MOVE_SPEED;
        phys.direction = 'right';
        phys.state = 'run';
     } else {
        phys.vx *= this.FRICTION;
        if (Math.abs(phys.vx) < 0.1) {
           phys.vx = 0;
           phys.state = 'idle';
        }
     }

     phys.vy += this.GRAVITY;

     const nextX = char.x + phys.vx;
     const nextY = char.y + phys.vy;
     
     let hasLanded = false;

     if (phys.vy >= 0) {
        const charBottom = char.y + char.height;
        const charCenterX = char.x + (char.width / 2);
        
        for (const item of items) {
           if (item.id === char.id || item.type === 'character') continue;
           
           if (charCenterX > item.x && charCenterX < item.x + item.width) {
              const itemTop = item.y;
              if (charBottom <= itemTop + 10 && (charBottom + phys.vy) >= itemTop) {
                 char.y = itemTop - char.height;
                 phys.vy = 0;
                 hasLanded = true;
                 break; 
              }
           }
        }
     }

     if (!hasLanded) {
        char.y = nextY;
        if (char.y + char.height >= this.FLOOR_Y) {
           char.y = this.FLOOR_Y - char.height;
           phys.vy = 0;
           hasLanded = true;
        }
     }
     
     char.x = nextX;

     if (hasLanded) {
        if (this.inputState.up) {
           phys.vy = this.JUMP_FORCE;
           phys.state = 'jump';
        } else {
           if (Math.abs(phys.vx) > 0.1) phys.state = 'run';
           else phys.state = 'idle';
        }
     } else {
        phys.state = 'jump';
     }

     if (char.x < 0) { char.x = 0; phys.vx = 0; }
     if (char.x > 3800) { char.x = 3800; phys.vx = 0; } 

     char.characterData = phys;
     const newItems = [...items];
     newItems[myIndex] = char;
     this.items.set(newItems);

     this.collabService.broadcastCharacterUpdate({
        id: char.id,
        x: char.x,
        y: char.y,
        data: phys
     });
     
     this.centerOnCharacter();
  }
  
  // Linear Interpolation for smooth remote movement
  updateRemotePhysics() {
     if (this.remoteTargets.size === 0) return;
     
     let needsUpdate = false;
     const currentItems = this.items();
     const newItems = [...currentItems];
     
     this.remoteTargets.forEach((target, id) => {
        const index = newItems.findIndex(i => i.id === id);
        if (index !== -1) {
           const item = { ...newItems[index] };
           
           // Lerp Factor: 0.2 means move 20% of the way to target per frame
           const lerpFactor = 0.2;
           
           const dx = target.x - item.x;
           const dy = target.y - item.y;
           
           if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
              item.x += dx * lerpFactor;
              item.y += dy * lerpFactor;
              
              if (target.data) {
                 item.characterData = target.data;
              }
              
              newItems[index] = item;
              needsUpdate = true;
           } else {
              // Snap if very close
              item.x = target.x;
              item.y = target.y;
              newItems[index] = item;
              // Remove from targets map if stabilized? No, keep it for constant updates.
           }
        }
     });
     
     if (needsUpdate) {
        this.items.set(newItems);
     }
  }
  
  centerOnCharacter() {
     const myChar = this.items().find(i => i.id === this.myCharacterId);
     if (!myChar) return;

     const w = window.innerWidth;
     const h = window.innerHeight;
     
     let targetPanX = -myChar.x * this.zoomScale() + (w / 2) - (myChar.width * this.zoomScale() / 2);
     let targetPanY = -myChar.y * this.zoomScale() + (h / 2) - (myChar.height * this.zoomScale() / 2);
     
     const currentPanX = this.panX();
     const currentPanY = this.panY();
     
     this.panX.set(currentPanX + (targetPanX - currentPanX) * 0.1);
     this.panY.set(currentPanY + (targetPanY - currentPanY) * 0.1);
  }

  handleRemoteCharacterUpdate(payload: any) {
     const { id, x, y, data } = payload;
     if (id === this.myCharacterId) return;

     // Instead of updating items directly (which causes snapping),
     // update the target map for the interpolation loop.
     this.remoteTargets.set(id, { x, y, data });
     
     // Ensure the item exists in the list if it's new
     const exists = this.items().some(i => i.id === id);
     if (!exists) {
        this.items.update(items => {
           const newItem: CapsuleItem = {
              id,
              type: 'character',
              content: 'sprite_default',
              x, y,
              width: 128, height: 128,
              zIndex: 5000,
              authorId: data.playerId,
              characterData: data
           };
           return [...items, newItem];
        });
     }
  }

  drawCharacters() {
     this.globalFrameTicker++;
     const chars = this.items().filter(i => i.type === 'character');
     
     chars.forEach(char => {
        const canvas = document.querySelector(`canvas[data-id="${char.id}"]`) as HTMLCanvasElement;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const phys = char.characterData;
        if (!phys) return;

        ctx.save();
        if (phys.direction === 'left') {
           ctx.scale(-1, 1);
           ctx.translate(-canvas.width, 0);
        }

        this.drawProceduralStickman(ctx, phys.state, canvas.width, canvas.height, phys.color);
        
        ctx.restore();
     });
  }

  drawProceduralStickman(ctx: CanvasRenderingContext2D, state: string, w: number, h: number, color: string) {
      const cx = w / 2;
      const cy = h / 2;
      const speed = 0.8;
      const t = this.globalFrameTicker;
      
      let leftLegAngle = 0;
      let rightLegAngle = 0;
      let leftArmAngle = 0;
      let rightArmAngle = 0;
      let bodyYOffset = 0;

      if (state === 'run') {
         leftLegAngle = Math.sin(t * speed) * 0.8;
         rightLegAngle = Math.sin(t * speed + Math.PI) * 0.8;
         leftArmAngle = Math.sin(t * speed + Math.PI) * 0.8;
         rightArmAngle = Math.sin(t * speed) * 0.8;
         bodyYOffset = Math.abs(Math.sin(t * speed * 2)) * 3;
      } else if (state === 'jump') {
         leftLegAngle = -0.5;
         rightLegAngle = 0.5;
         leftArmAngle = -2.5;
         rightArmAngle = -2.5; 
      } else {
         bodyYOffset = Math.sin(t * 0.1) * 2;
         leftArmAngle = 0.5;
         rightArmAngle = -0.5;
      }

      ctx.save();
      ctx.translate(0, bodyYOffset);

      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000';

      const legOriginX = cx;
      const legOriginY = cy + 20;
      const legLength = 15;

      ctx.beginPath();
      ctx.moveTo(legOriginX - 5, legOriginY);
      ctx.lineTo(legOriginX - 5 + Math.sin(leftLegAngle) * legLength, legOriginY + Math.cos(leftLegAngle) * legLength);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(legOriginX + 5, legOriginY);
      ctx.lineTo(legOriginX + 5 + Math.sin(rightLegAngle) * legLength, legOriginY + Math.cos(rightLegAngle) * legLength);
      ctx.stroke();

      const armOriginY = cy + 5;
      
      ctx.beginPath();
      ctx.moveTo(cx - 20, armOriginY);
      ctx.lineTo(cx - 20 + Math.sin(leftArmAngle) * 15 - 5, armOriginY + 15);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 20, armOriginY);
      ctx.lineTo(cx + 20 - Math.sin(rightArmAngle) * 15 + 5, armOriginY + 15);
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI * 2); 
      ctx.fill();
      ctx.stroke();
      
      ctx.restore();
  }
  
  // ------------------------------------

  centerView() {
     if (typeof window !== 'undefined') {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.panX.set((w - 4000) / 2);
        this.panY.set((h - 4000) / 2);
        this.zoomScale.set(Math.min(1, w / 1000));
     }
  }

  loadCapsule(id: string) {
    const c = this.capsuleService.getCapsule(id);
    if (c) {
      this.capsule.set(c);
      const user = this.currentUser();
      const isCreator = user && user.id === c.creatorId;
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
    if (this.capsuleService.isExpired(c)) {
       this.setReadOnlyMode();
    } else {
       this.isReadOnly.set(false);
       this.startTimer(c);
    }
    
    let user = this.currentUser();
    if (!user) {
       this.createGuestSession();
       user = this.currentUser();
    }
    
    const userId = user?.id || 'guest_' + Math.floor(Math.random() * 10000);
    this.collabService.init(userId, c.id);
  }
  
  createGuestSession() {
     const guestUser: User = {
        id: 'guest_' + crypto.randomUUID(),
        username: 'Guest',
        name: '방문자',
        avatarColor: '#9CA3AF', 
        createdAt: Date.now()
     };
     this.authService.currentUser.set(guestUser);
     localStorage.setItem('tc_session_v2', JSON.stringify(guestUser));
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
    const created = new Date(capsule.createdDate).getTime();
    const totalDuration = expiration - created;
    const halfTime = created + (totalDuration / 2);
    
    this.timerSub = interval(1000).subscribe(() => {
      const now = Date.now();
      const diff = expiration - now;
      if (now >= halfTime && this.items().length > 0) {
         this.checkVoteTrigger(capsule.id);
      }
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
      if (this.voteState() === 'voting') {
         this.voteTimer.update(t => {
            if (t <= 0) { this.endVoting(); return 0; }
            return t - 1;
         });
      }
      if (this.voteState() === 'destruction') {
         this.destructionTimer.update(t => {
            if (t <= 0) { this.endDestruction(); return 0; }
            return t - 1;
         });
      }
    });
  }
  
  checkVoteTrigger(capsuleId: string) {
     const hasVoted = localStorage.getItem(`voted_${capsuleId}`);
     if (!hasVoted && this.voteState() === 'idle') {
        localStorage.setItem(`voted_${capsuleId}`, 'true');
        this.collabService.broadcastVoteStart(Date.now() + 20000);
        this.startVoting();
     }
  }
  
  startVoting() {
     this.voteState.set('voting');
     this.voteTimer.set(20);
     this.voteCounts.set({});
     this.myVote.set(null);
  }
  
  onVoteClick(event: Event, item: CapsuleItem) {
     event.stopPropagation();
     if (this.voteState() !== 'voting' || this.myVote()) return;
     this.myVote.set(item.id);
     this.voteCounts.update(c => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
     this.collabService.broadcastCastVote(item.id);
  }
  
  endVoting() {
     if (this.voteState() !== 'voting') return;
     const counts = this.voteCounts();
     let max = -1;
     let winnerId: string | null = null;
     for (const [id, count] of Object.entries(counts)) {
        const val = count as number; 
        if (val > max) { max = val; winnerId = id; }
     }
     if (max > 0 && winnerId) {
        this.collabService.broadcastVoteEnd(winnerId);
        this.startDestruction(winnerId);
     } else {
        this.voteState.set('ended');
        this.collabService.broadcastVoteEnd(null);
     }
  }
  
  startDestruction(targetId: string) {
     this.voteState.set('destruction');
     this.destructionTargetId.set(targetId);
     this.targetHealth.set(30);
     this.launchCount.set(0);
     this.destructionTimer.set(30);
     this.showSpaceshipModal.set(true);
     setTimeout(() => this.initSpaceshipCanvas(), 100);
     this.startGameLoop();
  }
  
  endDestruction() {
     this.voteState.set('ended');
     this.stopGameLoop();
     this.projectiles.set([]);
     this.explosions.set([]);
     this.mySpaceship.set(null);
  }
  
  initSpaceshipCanvas() {
     if (this.spaceshipCanvas) {
        this.spaceCtx = this.spaceshipCanvas.nativeElement.getContext('2d')!;
        this.spaceCtx.lineWidth = 3;
        this.spaceCtx.lineCap = 'round';
        this.spaceCtx.strokeStyle = '#000';
     }
  }
  
  isSpaceDrawing = false;
  startSpaceshipDraw(e: MouseEvent) { this.isSpaceDrawing = true; this.spaceCtx.beginPath(); this.spaceCtx.moveTo(e.offsetX, e.offsetY); }
  drawSpaceship(e: MouseEvent) { if (!this.isSpaceDrawing) return; this.spaceCtx.lineTo(e.offsetX, e.offsetY); this.spaceCtx.stroke(); }
  startSpaceshipDrawTouch(e: TouchEvent) { e.preventDefault(); this.isSpaceDrawing = true; const rect = this.spaceshipCanvas.nativeElement.getBoundingClientRect(); const t = e.touches[0]; this.spaceCtx.beginPath(); this.spaceCtx.moveTo(t.clientX - rect.left, t.clientY - rect.top); }
  drawSpaceshipTouch(e: TouchEvent) { e.preventDefault(); if (!this.isSpaceDrawing) return; const rect = this.spaceshipCanvas.nativeElement.getBoundingClientRect(); const t = e.touches[0]; this.spaceCtx.lineTo(t.clientX - rect.left, t.clientY - rect.top); this.spaceCtx.stroke(); }
  stopSpaceshipDraw() { this.isSpaceDrawing = false; }
  clearSpaceshipCanvas() { this.spaceCtx.clearRect(0, 0, 200, 200); }
  saveSpaceship() {
     const data = this.spaceshipCanvas.nativeElement.toDataURL('image/png');
     this.mySpaceship.set(data);
     this.showSpaceshipModal.set(false);
  }
  
  launchSpaceship() {
     if (this.launchCount() >= 5 || !this.destructionTargetId()) return;
     this.launchCount.update(c => c + 1);
     const viewCX = (-this.panX() + (window.innerWidth / 2)) / this.zoomScale();
     const viewCY = (-this.panY() + window.innerHeight) / this.zoomScale();
     const projectile: any = { startX: viewCX, startY: viewCY, image: this.mySpaceship() };
     this.collabService.broadcastGameEvent('LAUNCH', projectile);
     this.spawnProjectile(projectile.startX, projectile.startY, projectile.image);
  }
  
  spawnProjectile(x: number, y: number, image: string) {
     const targetId = this.destructionTargetId();
     if (!targetId) return;
     const p: Projectile = { id: crypto.randomUUID(), x, y, image, targetId, speed: 8 };
     this.projectiles.update(list => [...list, p]);
  }
  
  startGameLoop() {
     if (this.gameLoopId) return;
     const loop = () => {
        if (this.voteState() !== 'destruction') { this.stopGameLoop(); return; }
        this.updateGameState();
        this.gameLoopId = requestAnimationFrame(loop);
     };
     this.gameLoopId = requestAnimationFrame(loop);
  }
  
  stopGameLoop() {
     if (this.gameLoopId) { cancelAnimationFrame(this.gameLoopId); this.gameLoopId = null; }
  }
  
  updateGameState() {
     const targetId = this.destructionTargetId();
     if (!targetId) return;
     const targetItem = this.items().find(i => i.id === targetId);
     if (!targetItem) return;
     const targetCX = targetItem.x + (targetItem.width / 2);
     const targetCY = targetItem.y + (targetItem.height || 100) / 2;
     this.projectiles.update(list => {
        const nextList: Projectile[] = [];
        let damageDealt: number = 0; 
        for (const p of list) {
           const dx = targetCX - p.x;
           const dy = targetCY - p.y;
           const dist = Math.sqrt(dx*dx + dy*dy);
           if (dist < 20) { damageDealt++; this.spawnExplosion(p.x, p.y); } 
           else {
              const vx = (dx / dist) * p.speed;
              const vy = (dy / dist) * p.speed;
              p.x += vx; p.y += vy;
              nextList.push(p);
           }
        }
        if (damageDealt > 0) { this.applyDamage(damageDealt); }
        return nextList;
     });
     if (this.explosions().length > 5) { this.explosions.update(e => e.slice(1)); }
  }
  
  spawnExplosion(x: number, y: number) {
     const id = crypto.randomUUID();
     this.explosions.update(e => [...e, { id, x, y }]);
     setTimeout(() => { this.explosions.update(list => list.filter(ex => ex.id !== id)); }, 500);
  }
  
  applyDamage(amount: number) {
     const currentHp = this.targetHealth();
     const newHp = Math.max(0, currentHp - amount);
     this.targetHealth.set(newHp);
     if (newHp <= 0 && this.voteState() === 'destruction') { this.destroyTarget(); }
  }
  
  destroyTarget() {
     const tid = this.destructionTargetId();
     if (!tid) return;
     const newItems = this.items().filter(i => i.id !== tid);
     this.items.set(newItems);
     if (this.capsule()) { this.capsuleService.updateCapsuleItems(this.capsule()!.id, newItems); }
     this.collabService.addNotification('💥 게시물이 파괴되었습니다!');
     this.endDestruction();
  }
  
  handleGameEvent(event: any) {
     if (event.type === 'VOTE_START') { this.startVoting(); } 
     else if (event.type === 'CAST_VOTE') {
        const itemId = String(event.payload.itemId);
        this.voteCounts.update(c => ({ ...c, [itemId]: (c[itemId] || 0) + 1 }));
     } else if (event.type === 'VOTE_END') {
        const winner = event.payload.winnerId;
        if (winner) { this.startDestruction(winner); } else { this.voteState.set('ended'); }
     } else if (event.type === 'GAME_EVENT') {
        const { eventType, data } = event.payload;
        if (eventType === 'LAUNCH') { this.spawnProjectile(data.startX, data.startY, data.image); }
     }
  }

  async downloadSnapshot() {
     this.isCapturing = true; 
     setTimeout(() => {
        if (typeof html2canvas !== 'undefined' && this.captureArea) {
           html2canvas(this.captureArea.nativeElement, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' }).then((canvas: HTMLCanvasElement) => {
              const link = document.createElement('a');
              link.download = `time_capsuffle_${this.capsule()?.name || 'memory'}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              this.isCapturing = false;
           }).catch((err: any) => { console.error(err); alert('스크린샷 저장 중 오류가 발생했습니다.'); this.isCapturing = false; });
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

  pad(n: number): string { return n < 10 ? '0' + n : '' + n; }
  getDurationLabel(value: string): string { const map: Record<string, string> = { '1d': '24시간', '1w': '7일', '1m': '30일', '1y': '365일' }; return map[value] || value; }

  ngOnDestroy() {
    this.collabService.leave();
    if (this.timerSub) this.timerSub.unsubscribe();
    this.stopStream();
    this.stopGameLoop();
    if (this.physicsLoopId) cancelAnimationFrame(this.physicsLoopId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.onResize);
  }

  goBack() { this.router.navigate(['/home']); }
  toggleSidebar() { this.isSidebarOpen.update(v => !v); }

  sendChat(event: Event) {
    event.preventDefault();
    if (!this.chatInput) return;
    const text = this.chatInput.nativeElement.value.trim();
    if (!text) return;
    const user = this.currentUser();
    this.collabService.broadcastChat(text, user?.name || 'Guest', user?.avatarColor || '#6B7280');
    this.chatInput.nativeElement.value = '';
  }

  zoomIn() { this.updateZoom(0.1); }
  zoomOut() { this.updateZoom(-0.1); }
  resetZoom() { this.zoomScale.set(1); this.centerView(); }
  updateZoom(delta: number) { const newScale = Math.min(Math.max(0.2, this.zoomScale() + delta), 4); this.zoomScale.set(newScale); }

  onWheel(event: WheelEvent) {
     event.preventDefault();
     if (event.ctrlKey || Math.abs(event.deltaY) < 10) { 
        const delta = -event.deltaY * 0.005;
        const scale = this.zoomScale();
        const newScale = Math.min(Math.max(0.2, scale + delta), 4);
        this.zoomScale.set(newScale);
     } else {
        this.panX.update(x => x - event.deltaX);
        this.panY.update(y => y - event.deltaY);
     }
  }

  getCanvasPoint(clientX: number, clientY: number) {
     if (!this.canvasContainer || !this.canvasContainer.nativeElement) return { x: 0, y: 0 };
     const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
     return { 
        x: (clientX - rect.left - this.panX()) / this.zoomScale(), 
        y: (clientY - rect.top - this.panY()) / this.zoomScale() 
     };
  }

  onMouseDown(event: MouseEvent) { 
     if (this.isPlacingCharacter()) {
        const pt = this.getCanvasPoint(event.clientX, event.clientY);
        this.spawnCharacterAt(pt.x, pt.y);
        this.isPlacingCharacter.set(false);
        this.collabService.addNotification('🎮 캐릭터 생성 완료! 방향키로 이동하세요.');
        return;
     }

     if (this.selectedItemId()) {
        this.selectedItemId.set(null);
     }
     
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
    const pt = this.getCanvasPoint(event.clientX, event.clientY);
    this.handleCursorAndItemDrag(pt.x, pt.y);
  }

  onTouchStart(event: TouchEvent) {
    if (this.isPlacingCharacter() && event.touches.length === 1) {
       event.preventDefault();
       const touch = event.touches[0];
       const pt = this.getCanvasPoint(touch.clientX, touch.clientY);
       this.spawnCharacterAt(pt.x, pt.y);
       this.isPlacingCharacter.set(false);
       this.collabService.addNotification('🎮 캐릭터 생성 완료!');
       return;
    }

    if (event.target === this.canvasContainer.nativeElement || event.target === this.captureArea.nativeElement) {
       this.selectedItemId.set(null);
    }

    if (this.isLocked()) return;
    if (event.touches.length === 2) { this.isPinching = true; this.lastTouchDistance = this.getTouchDistance(event.touches); return; }
    if (this.isDragging()) return;
    this.isPanning = true;
    const touch = event.touches[0];
    this.lastMousePos = { x: touch.clientX, y: touch.clientY };
  }

  onTouchMove(event: TouchEvent) {
    if (this.isLocked()) return;
    if (event.cancelable) event.preventDefault();
    if (this.isPinching && event.touches.length === 2) {
       const dist = this.getTouchDistance(event.touches);
       const delta = dist - this.lastTouchDistance;
       const zoomDelta = delta * 0.005; 
       const newScale = Math.min(Math.max(0.2, this.zoomScale() + zoomDelta), 4);
       this.zoomScale.set(newScale);
       this.lastTouchDistance = dist;
       return;
    }
    if (this.isPanning && event.touches.length === 1 && !this.isDragging()) {
      const touch = event.touches[0];
      const dx = touch.clientX - this.lastMousePos.x;
      const dy = touch.clientY - this.lastMousePos.y;
      this.panX.update(x => x + dx);
      this.panY.update(y => y + dy);
      this.lastMousePos = { x: touch.clientX, y: touch.clientY };
      return;
    }
    if (event.touches.length === 1) {
       const touch = event.touches[0];
       const pt = this.getCanvasPoint(touch.clientX, touch.clientY);
       this.handleCursorAndItemDrag(pt.x, pt.y);
    }
  }
  
  getTouchDistance(touches: TouchList) {
     const t1 = touches[0]; const t2 = touches[1];
     const dx = t1.clientX - t2.clientX; const dy = t1.clientY - t2.clientY;
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
       newX = Math.max(0, Math.min(newX, 4000 - item.width));
       newY = Math.max(0, Math.min(newY, 4000 - (item.height || 100)));
       this.items.update(items => items.map(i => i.id === item.id ? { ...i, x: newX, y: newY } : i));
    }
  }

  onMouseUp() {
    this.isPanning = false; this.isPinching = false;
    if (this.isDragging() && this.draggedItem() && !this.isReadOnly()) {
      const c = this.capsule();
      if (c) { this.capsuleService.updateCapsuleItems(c.id, this.items()); this.collabService.broadcastItemUpdate(this.items()); }
    }
    this.isDragging.set(false); this.draggedItem.set(null);
  }

  startDrag(event: MouseEvent, item: CapsuleItem) {
    if (this.isReadOnly() || this.isLocked() || this.playingVideoId() === item.id || this.voteState() !== 'idle') return;
    event.stopPropagation(); event.preventDefault();
    const pt = this.getCanvasPoint(event.clientX, event.clientY);
    this.selectedItemId.set(item.id);
    this.isDragging.set(true); this.draggedItem.set(item);
    this.dragOffset = { x: pt.x - item.x, y: pt.y - item.y };
  }

  startDragTouch(event: TouchEvent, item: CapsuleItem) {
    if (this.isReadOnly() || this.isLocked() || this.playingVideoId() === item.id || this.voteState() !== 'idle') return;
    event.stopPropagation(); if (event.cancelable) event.preventDefault();
    const touch = event.touches[0]; const pt = this.getCanvasPoint(touch.clientX, touch.clientY);
    this.selectedItemId.set(item.id);
    this.isDragging.set(true); this.draggedItem.set(item);
    this.dragOffset = { x: pt.x - item.x, y: pt.y - item.y };
  }
  
  selectItem(event: Event, item: CapsuleItem) {
     if (this.isDragging()) return;
     this.selectedItemId.set(item.id);
  }
  
  deleteItem(event: Event, item: CapsuleItem) {
    event.stopPropagation();
    event.preventDefault(); 
    
    if (this.isReadOnly()) return;
    if (!this.capsule()) return;
    
    const newItems = this.items().filter(i => i.id !== item.id);
    this.items.set(newItems);
    this.capsuleService.updateCapsuleItems(this.capsule()!.id, newItems);
    this.collabService.broadcastItemUpdate(newItems);
    this.selectedItemId.set(null);
  }

  onDrop(event: DragEvent) {
    if (this.isReadOnly() || this.isLocked()) return;
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) this.mediaType.set('image');
      else if (file.type.startsWith('video/')) this.mediaType.set('video');
      
      this.verificationChecked = true; 
      this.handleFile(file);
    }
  }

  openMediaModal(type: 'image' | 'video' | 'audio' | 'gif' | 'sticker' | 'ai') {
    if (this.isReadOnly()) return;
    this.mediaType.set(type);
    this.showMediaModal.set(true);
    
    this.verificationChecked = false;
    this.shakeVerification = false;
    
    if (type === 'image' || type === 'video') this.mediaTab.set('file');
    else if (type === 'audio') this.mediaTab.set('record');
    else this.mediaTab.set('file');
  }
  
  getFileAccept() {
     const type = this.mediaType();
     if (type === 'image') return 'image/*';
     if (type === 'video') return 'video/*';
     if (type === 'audio') return 'audio/*';
     return '*/*';
  }

  toggleVerification() {
     this.verificationChecked = !this.verificationChecked;
     this.shakeVerification = false;
  }
  
  triggerFileUpload() {
     if (!this.verificationChecked) {
        this.shakeVerification = true;
        setTimeout(() => this.shakeVerification = false, 500);
        return;
     }
     this.fileInput?.nativeElement.click();
  }

  openCamera() {
    this.mediaTab.set('camera');
    this.videoStream = null;
  }

  async startAudioRecording() {
     try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = (e) => {
           if (e.data.size > 0) this.audioChunks.push(e.data);
        };
        this.mediaRecorder.onstop = () => {
           const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
           const reader = new FileReader();
           reader.readAsDataURL(blob);
           reader.onloadend = () => {
              const base64 = reader.result as string;
              this.addItem('audio', base64, 200, 60);
              this.showMediaModal.set(false);
              stream.getTracks().forEach(track => track.stop());
           };
           this.isRecording = false;
           this.recordingSeconds = 0;
           if (this.recordingTimer) clearInterval(this.recordingTimer);
        };
        this.mediaRecorder.start();
        this.isRecording = true;
        this.recordingSeconds = 0;
        this.recordingTimer = setInterval(() => {
           this.recordingSeconds++;
           if (this.recordingSeconds >= 60) {
              this.stopAudioRecording();
              alert('최대 녹음 시간(60초)에 도달했습니다.');
           }
        }, 1000);
     } catch (e) {
        console.error(e);
        alert('마이크 접근 권한이 필요합니다.');
     }
  }

  stopAudioRecording() {
     if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
     }
  }

  recordingTimeDisplay() {
     const m = Math.floor(this.recordingSeconds / 60);
     const s = this.recordingSeconds % 60;
     return `${m}:${s < 10 ? '0' + s : s}`;
  }

  async startVideoRecording() {
    try {
      if (!this.videoStream) {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (this.videoPreview) {
          this.videoPreview.nativeElement.srcObject = this.videoStream;
        }
      }
      this.mediaRecorder = new MediaRecorder(this.videoStream);
      this.audioChunks = []; 
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) this.audioChunks.push(event.data);
      };
      this.mediaRecorder.onstop = () => {
         const videoBlob = new Blob(this.audioChunks, { type: 'video/webm' });
         const reader = new FileReader();
         reader.readAsDataURL(videoBlob);
         reader.onloadend = () => {
            const base64 = reader.result as string;
            this.addItem('video', base64, 480, 360);
            this.showMediaModal.set(false);
            this.stopStream();
         };
         this.isRecording = false;
      };
      this.mediaRecorder.start();
      this.isRecording = true;
      setTimeout(() => { if (this.isRecording) { this.stopVideoRecording(); alert('영상 촬영은 최대 10초까지 가능합니다.'); } }, 10000);
    } catch (e) { console.error(e); alert('카메라 접근 권한이 필요합니다.'); }
  }

  stopVideoRecording() { if (this.mediaRecorder && this.isRecording) { this.mediaRecorder.stop(); } }
  stopStream() { if (this.videoStream) { this.videoStream.getTracks().forEach(track => track.stop()); this.videoStream = null; } }

  async handleFile(file: File) {
    if (!this.verificationChecked) {
       if (!confirm("직접 촬영하거나 제작한 콘텐츠가 맞습니까?")) {
          return;
       }
       this.verificationChecked = true;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
        alert('지원하지 않는 파일 형식입니다. (이미지 또는 동영상만 가능)');
        return;
    }

    const MAX_IMG_SIZE = 10 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

    if (isImage && file.size > MAX_IMG_SIZE) {
        alert('이미지 용량은 10MB 이하여야 합니다.');
        return;
    }
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
        alert('영상 용량은 50MB 이하여야 합니다.');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        const result = e.target?.result as string;
        
        if (isImage) {
            this.addItem('image', result, 300, 300);
        } else {
            this.addItem('video', result, 480, 360);
        }
        
        this.showMediaModal.set(false);
    };
    
    reader.onerror = (e) => {
        console.error('File reading failed:', e);
        alert('파일을 읽는 중 오류가 발생했습니다.');
    };

    reader.readAsDataURL(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
       this.handleFile(input.files[0]);
    }
    if (input) input.value = '';
  }

  // --- Added Missing Methods ---

  addItem(type: CapsuleItem['type'], content: string, width: number, height: number) {
    if (this.isReadOnly()) return;
    
    // Calculate center of current view
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    
    // Convert to canvas coordinates: (Screen - Pan) / Zoom
    const canvasX = (cx - this.panX()) / this.zoomScale();
    const canvasY = (cy - this.panY()) / this.zoomScale();
    
    // Center the item
    const x = canvasX - (width / 2);
    const y = canvasY - (height / 2);

    const newItem: CapsuleItem = {
      id: crypto.randomUUID(),
      type,
      content,
      x,
      y,
      width,
      height,
      zIndex: this.items().length + 100,
      authorId: this.currentUser()?.id || 'guest'
    };

    if (this.capsule()) {
      this.capsuleService.addItemToCapsule(this.capsule()!.id, newItem);
      this.items.update(prev => [...prev, newItem]);
      this.collabService.broadcastItemAdd(newItem);
    }
  }

  openTextModal() {
    this.textModalValue = '';
    this.showTextModal.set(true);
  }

  submitText() {
    if (!this.textModalValue.trim()) return;
    this.addItem('text', this.textModalValue, 300, 200);
    this.showTextModal.set(false);
  }

  pickRandomQuestion() {
    const q = this.questions[Math.floor(Math.random() * this.questions.length)];
    this.textModalValue = q;
  }

  openStickerModal() {
    this.showStickerModal.set(true);
  }

  addSticker(sticker: string) {
    this.addItem('sticker', sticker, 150, 150);
    this.showStickerModal.set(false);
  }

  openDrawingModal() {
    this.showDrawingModal.set(true);
    setTimeout(() => this.initDrawingCanvas(), 100);
  }

  initDrawingCanvas() {
    if (this.drawingCanvas) {
       this.ctx = this.drawingCanvas.nativeElement.getContext('2d')!;
       this.ctx.lineCap = 'round';
       this.ctx.lineJoin = 'round';
       this.updateLineWidth();
       this.setDrawColor(this.drawColor);
    }
  }

  setDrawColor(color: string) {
    this.drawColor = color;
    if (this.ctx) this.ctx.strokeStyle = color;
  }

  updateLineWidth() {
    if (this.ctx) this.ctx.lineWidth = this.lineWidth;
  }
  
  startDrawing(e: MouseEvent) {
    this.isDrawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(e.offsetX, e.offsetY);
  }
  
  draw(e: MouseEvent) {
    if (!this.isDrawing) return;
    this.ctx.lineTo(e.offsetX, e.offsetY);
    this.ctx.stroke();
  }
  
  stopDrawing() {
    this.isDrawing = false;
  }

  startDrawingTouch(e: TouchEvent) {
    e.preventDefault();
    this.isDrawing = true;
    const rect = this.drawingCanvas.nativeElement.getBoundingClientRect();
    const t = e.touches[0];
    this.ctx.beginPath();
    this.ctx.moveTo(t.clientX - rect.left, t.clientY - rect.top);
  }

  drawTouch(e: TouchEvent) {
    e.preventDefault();
    if (!this.isDrawing) return;
    const rect = this.drawingCanvas.nativeElement.getBoundingClientRect();
    const t = e.touches[0];
    this.ctx.lineTo(t.clientX - rect.left, t.clientY - rect.top);
    this.ctx.stroke();
  }

  clearDrawing() {
     if (this.ctx) this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
  }

  saveDrawing() {
     const data = this.drawingCanvas.nativeElement.toDataURL('image/png');
     this.addItem('drawing', data, 400, 400); 
     this.showDrawingModal.set(false);
  }

  // --- YouTube & Video Helpers ---

  isYouTube(url: string): boolean {
    return (url.includes('youtube.com') || url.includes('youtu.be'));
  }
  
  getYouTubeEmbed(url: string): SafeResourceUrl {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop() || '';
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
  
  getYouTubeThumbnail(url: string): string {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop() || '';
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  playVideo(itemId: string) {
    this.playingVideoId.set(itemId);
  }

  stopVideo(event: Event) {
    event.stopPropagation();
    this.playingVideoId.set(null);
  }
}