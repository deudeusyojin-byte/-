import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 bg-[#FAFAF9]">
      <div class="bg-white border border-stone-200 shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row h-[600px] rounded-2xl">
        
        <!-- Decoration Left Side -->
        <div class="hidden md:flex w-1/2 bg-stone-900 p-12 flex-col justify-between relative overflow-hidden">
          <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div class="relative z-10">
             <div class="w-12 h-12 border-2 border-stone-500 rounded-lg mb-8 flex items-center justify-center text-stone-300 font-serif italic text-2xl">T</div>
             <h2 class="text-5xl font-serif text-white mb-6 leading-tight font-bold">Time<br><span class="italic text-stone-400">Capsuffle</span></h2>
             <p class="text-stone-400 text-lg leading-relaxed font-light">
               소중한 기억을 보관하는<br>가장 아름다운 방법.
             </p>
          </div>

          <div class="relative z-10">
             <div class="w-full h-px bg-stone-800 mb-6"></div>
             <div class="flex gap-4 text-xs text-stone-500 font-medium">
                <span>Since 2024</span>
                <span>•</span>
                <span>Secure Archive</span>
             </div>
          </div>
          
          <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-stone-800 rounded-full blur-3xl opacity-40 mix-blend-screen"></div>
        </div>

        <!-- Form Right Side -->
        <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative overflow-y-auto">
          
          <div class="mb-8 text-center md:text-left">
            <h3 class="text-3xl font-serif font-bold text-stone-900 mb-2">{{ isLogin() ? '로그인' : '회원가입' }}</h3>
            <p class="text-stone-500">{{ isLogin() ? '계정에 로그인하여 시작하세요.' : '나만의 타임캡슐을 만들어보세요.' }}</p>
          </div>

          <!-- Email Form -->
          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            
            @if (!isLogin()) {
              <div class="space-y-1 animate-fade-in">
                <label class="block text-xs font-bold text-stone-500">이름</label>
                <input formControlName="name" type="text" class="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-stone-800 focus:bg-white outline-none transition text-stone-900 placeholder-stone-300" placeholder="홍길동">
              </div>
            }

            <div class="space-y-1">
              <label class="block text-xs font-bold text-stone-500">이메일</label>
              <input formControlName="email" type="email" class="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-stone-800 focus:bg-white outline-none transition text-stone-900 placeholder-stone-300" placeholder="example@email.com">
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-stone-500">비밀번호</label>
              <input formControlName="password" type="password" class="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-stone-800 focus:bg-white outline-none transition text-stone-900 placeholder-stone-300" placeholder="••••••••">
            </div>

            @if (errorMsg()) {
              <div class="text-red-500 text-sm py-1 font-medium flex items-center animate-fade-in">
                <span class="mr-2">●</span> {{ errorMsg() }}
              </div>
            }

            <button type="submit" class="w-full bg-stone-900 text-white font-bold py-3.5 rounded-lg hover:bg-black transition shadow-lg mt-2">
               {{ isLogin() ? '로그인' : '회원가입 완료' }}
            </button>

          </form>

          <div class="mt-6 text-center flex items-center justify-center gap-3">
            <span class="text-stone-400 text-sm">{{ isLogin() ? '계정이 없으신가요?' : '이미 계정이 있으신가요?' }}</span>
            <button (click)="toggleMode()" class="text-stone-900 font-bold hover:underline text-sm">
              {{ isLogin() ? '회원가입' : '로그인' }}
            </button>
          </div>
          
          <div class="mt-6 text-center">
             <a routerLink="/home" class="text-xs text-stone-400 hover:text-stone-600">← 홈으로 돌아가기</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  
  isLogin = signal(true);
  errorMsg = signal('');
  
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    name: ['']
  });

  toggleMode() {
    this.isLogin.update(v => !v);
    this.errorMsg.set('');
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) {
      this.errorMsg.set('모든 정보를 올바르게 입력해주세요.');
      return;
    }

    const { email, password, name } = this.form.value;

    if (this.isLogin()) {
      // Login Logic
      const success = this.authService.login(email!, password!);
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.errorMsg.set('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } else {
      // Register Logic
      if (!name) {
        this.errorMsg.set('이름을 입력해주세요.');
        return;
      }
      const success = this.authService.register(name!, email!, password!);
      if (success) {
        alert('환영합니다! 가입이 완료되었습니다.');
        this.router.navigate(['/home']);
      } else {
        this.errorMsg.set('이미 가입된 이메일입니다.');
      }
    }
  }
}