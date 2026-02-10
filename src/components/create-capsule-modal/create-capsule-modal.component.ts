import { Component, output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CapsuleService } from '../../services/capsule.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-capsule-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-fade-in">
        <div class="bg-indigo-600 p-6">
          <h2 class="text-2xl font-bold text-white">공동 캡슐 만들기</h2>
          <p class="text-indigo-100 mt-1">친구들과 공유할 비밀 캡슐을 생성합니다.</p>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="create()" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">캡슐 이름</label>
            <input 
              type="text" 
              formControlName="name"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="예: 우리들의 2024 여름"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">입장 비밀번호</label>
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-mono"
              placeholder="친구들에게 공유할 비밀번호"
            >
            <p class="text-xs text-gray-500 mt-1">* 캡슐 생성자(본인)는 비밀번호 없이 입장 가능합니다.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">보관 기한 (숫자)</label>
            <div class="grid grid-cols-4 gap-2">
              @for (opt of durationOptions; track opt.value) {
                <label 
                  class="cursor-pointer border rounded-lg p-2 text-center transition hover:bg-indigo-50"
                  [class.ring-2]="form.value.duration === opt.value"
                  [class.ring-indigo-600]="form.value.duration === opt.value"
                  [class.bg-indigo-50]="form.value.duration === opt.value"
                  [class.border-indigo-200]="form.value.duration === opt.value"
                >
                  <input type="radio" formControlName="duration" [value]="opt.value" class="sr-only">
                  <span class="block text-sm font-bold text-gray-900">{{ opt.label }}</span>
                </label>
              }
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button 
              type="button" 
              (click)="close.emit()" 
              class="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              취소
            </button>
            <button 
              type="submit" 
              [disabled]="form.invalid"
              class="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-200"
            >
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class CreateCapsuleModalComponent {
  close = output<void>();
  
  private fb: FormBuilder = inject(FormBuilder);
  capsuleService = inject(CapsuleService);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    duration: ['1w', Validators.required]
  });

  durationOptions = [
    { label: '24시간', value: '1d' },
    { label: '7일', value: '1w' },
    { label: '30일', value: '1m' },
    { label: '365일', value: '1y' }
  ];

  create() {
    if (this.form.invalid) return;

    const { name, duration, password } = this.form.value;
    const user = this.authService.currentUser();
    
    if (name && duration && user && password) {
      const id = this.capsuleService.createCapsule(name, duration, user.id, password);
      this.close.emit();
      this.router.navigate(['/capsule', id]);
    }
  }
}